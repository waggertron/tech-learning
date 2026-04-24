---
title: A scikit-learn re-ranker inside an OR-Tools objective
description: The VRP solver knows about drive time. It doesn't know "this patient prefers Sarah" or "this clinician runs late on Tuesdays." A small gradient-boosted model injected into the objective function does.
date: 2026-04-24
tags: [or-tools, sklearn, ml, optimization, cs-challenges]
crosspost: [devto, linkedin]
canonical: https://waggertron.github.io/tech-learning/posts/2026-04-24-ml-reranker-inside-or-tools-objective/
---

## Where optimizers stop being enough

An OR-Tools VRP minimizes something like *total drive time + window violations + skill penalties*. It's good at that. What it doesn't know:

- This patient has had three visits with clinician A and two with B — A got higher satisfaction scores.
- This clinician is late on Tuesday mornings, historically.
- A visit at 14:00 in Santa Monica after a visit in Downtown LA is nominally feasible on haversine + 40 mph, but the traffic reality says otherwise.

These aren't constraints. They're preferences learned from data. The right tool is an ML model that scores each candidate (visit, clinician) pair, and the right way to use that score is to **inject it into the optimizer's objective function**.

## The hybrid pattern: OR handles hard constraints, ML handles soft preferences

The objective becomes:

```
minimize  total_drive_time
        + α · window_violation_penalty
        + β · skill_mismatch_penalty
        - γ · sum(rerank_score(visit, assigned_clinician))
```

- **α, β** penalize constraint violations — keep them large so the solver respects them.
- **γ** weights the ML score. Larger γ → the optimizer prefers high-scoring assignments even at some drive-time cost.

The negative sign on the ML term is deliberate: the model predicts a "goodness score" in [0, 1], so we *subtract* it from the cost we're minimizing.

## The model

Nothing fancy. Gradient-boosted regressor, trained on historical visits:

```python
# scheduling/training.py
from sklearn.ensemble import GradientBoostingRegressor
import joblib

FEATURES = [
    "clinician_on_time_pct_30d",
    "visits_this_patient_this_clinician",
    "credential_gap",          # ordinal: clinician skill - required skill
    "hour_of_day",
    "day_of_week",
    "traffic_bucket",          # 0-4, derived from hour + region
]

def train(df, out_path="ranker.pkl"):
    X = df[FEATURES]
    y = df["success_score"]    # blend of on_time + satisfaction
    model = GradientBoostingRegressor(
        n_estimators=200, max_depth=4, learning_rate=0.05,
        random_state=42,
    )
    model.fit(X, y)
    joblib.dump(model, out_path)
```

Training data is synthetic for a portfolio project — a seed script simulates 90 days with realistic noise. The model's job isn't to make a revolutionary prediction; it's to make the solver pick "Sarah for Mrs. Chen" over "Jordan for Mrs. Chen" when both are feasible.

## Loading the model once, scoring in the hot loop

The VRP callback runs thousands of times per solve. Loading the model in the callback is catastrophic. Load once, close over it:

```python
# scheduling/ranker.py
import joblib
import numpy as np

_model = None

def load_model(path="ranker.pkl"):
    global _model
    if _model is None:
        _model = joblib.load(path)
    return _model

def score(visit, clinician) -> float:
    features = np.array([[
        clinician.on_time_pct_30d,
        count_prior_visits(visit.patient_id, clinician.id),
        clinician.credential_ordinal - visit.required_credential_ordinal,
        visit.window_start.hour,
        visit.window_start.weekday(),
        traffic_bucket(visit.window_start, visit.patient.region),
    ]])
    return float(load_model().predict(features)[0])
```

## Wiring the score into OR-Tools

OR-Tools doesn't take arbitrary per-assignment penalties directly — its arc costs are between nodes, not between vehicle-and-node. There are two common approaches:

### Approach 1: precompute a `vehicle_arc_cost` matrix

```python
# For each (clinician, visit) pair, precompute:
#   arc_cost = travel_time - gamma * score(visit, clinician) * scaling_factor
# Register one transit callback per vehicle, using that vehicle's row.

for v_idx, clin in enumerate(clinicians):
    def make_cb(vehicle_index):
        def cb(from_index, to_index):
            from_node = manager.IndexToNode(from_index)
            to_node = manager.IndexToNode(to_index)
            # standard travel time
            cost = time_matrix[from_node][to_node]
            # subtract ML bonus if arriving at a real visit node
            if to_node < len(visits):
                visit = visits[to_node]
                cost -= int(GAMMA * score(visit, clinicians[vehicle_index]) * 100)
            return max(cost, 0)
        return cb
    cb_idx = routing.RegisterTransitCallback(make_cb(v_idx))
    routing.SetArcCostEvaluatorOfVehicle(cb_idx, v_idx)
```

One transit callback per vehicle, closed over the clinician index. The ML score shows up as an **arrival bonus** — a high-scoring pairing makes the arc cheaper to traverse.

### Approach 2: precompute all scores, use a dimension

```python
# Add a "ScoreBonus" dimension that tracks cumulative ML bonus per vehicle.
# The solver's objective already sums cumulative costs; use SetFixedCostOfVehicle
# negatively calibrated with the expected score contribution.
```

Approach 2 is cleaner mathematically but harder to scale. Approach 1 is what the project uses.

## Integer arithmetic, scaling, and overflow

OR-Tools arc costs are integers. ML scores are floats in [0, 1]. Multiply by 100 (or 1000) before casting. Also clamp — if the model ever produces an outlier, you don't want the arc cost to go wildly negative and break the solver:

```python
bonus = int(np.clip(score_value * 100, 0, 100))
```

Cast + clip = safety.

## Retraining

A weekly Celery task (`ml.retrain`) reads the latest data from the reporting schema, fits a new model, writes a new pickle, and bumps a "model version" marker. The scoring function checks the marker on each solve; if it's changed, it reloads the pickle. Zero downtime, clean rollback if the new model is worse (revert the file).

## The philosophical point

OR does hard constraints well. ML does soft preferences well. Putting them in the same objective function is underrated. It's not a novel research idea — it's a practical engineering pattern that shows up in ride dispatch, delivery routing, warehouse picking, anywhere a solver and a predictor have to collaborate. The hard part is keeping the ML score bounded and the weights sane.

## See also

- [Vehicle Routing Problem — topic](../topics/cs/vehicle-routing/) — the VRP background
- [OR-Tools VRP with skill constraints](./2026-04-24-or-tools-vrp-with-skill-constraints/) — the solver setup this post plugs into
- Repo: [`home-health-provider-skeleton`](https://github.com/waggertron/home-health-provider-skeleton) — code in `apps/api/scheduling/ranker.py` and `apps/api/scheduling/vrp.py`
