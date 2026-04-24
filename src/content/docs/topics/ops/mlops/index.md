---
title: MLOps
description: The engineering discipline around getting ML models into production and keeping them useful. Experiment tracking, feature stores, model registries, serving, monitoring drift, and retraining, what each layer does and when you actually need it.
category: ops
tags: [mlops, machine-learning, mlflow, feature-stores, monitoring]
status: draft
created: 2026-04-24
updated: 2026-04-24
---

## The gap MLOps closes

A trained model in a notebook and a model serving production traffic are separated by a dozen problems that aren't about ML:

- How do you version the training code, data, and hyperparameters together so you can reproduce a run from three months ago?
- How does a model get from a data scientist's laptop to something an app can call over HTTP?
- What happens when the input distribution drifts and the model starts making confidently wrong predictions?
- How do you retrain without breaking everything that depends on the current model?
- How do you A/B test a new model against the current one?

MLOps is the name for the engineering practice that answers these. The term is modeled on DevOps, same instincts (automation, version control, monitoring, continuous delivery), applied to models instead of services.

## The MLOps lifecycle

```
Data → Features → Train → Validate → Register → Deploy → Monitor → Retrain
 ↑                                                          │
 └──────────────────────────────────────────────────────────┘
```

Every arrow is a place where things go wrong. The whole discipline is about turning each arrow into something automated, versioned, and observable.

## The five layers of an MLOps stack

Real-world MLOps platforms break into five layers. You don't need all of them on day one; the point is to know which are missing.

### 1. Experiment tracking

**Problem:** a data scientist runs 40 variations of a model. Three months later, nobody remembers which hyperparameters produced the best one.

**Solution:** log every run to a central store. Code commit SHA, dataset hash, hyperparameters, metrics, artifacts.

**Tools:**

- [MLflow](https://mlflow.org/), open-source, file- or DB-backed, minimal setup
- [Weights & Biases](https://wandb.ai/), SaaS, rich dashboards, team collaboration
- [Neptune](https://neptune.ai/), SaaS, strong metadata organization
- [Comet](https://www.comet.com/), SaaS, similar to W&B
- [TensorBoard](https://www.tensorflow.org/tensorboard), logs only; use with one of the above for registry

Minimal MLflow example:

```python
import mlflow
import mlflow.sklearn
from sklearn.ensemble import GradientBoostingRegressor

mlflow.set_experiment("visit-reranker")

with mlflow.start_run():
    mlflow.log_params({"n_estimators": 200, "max_depth": 4})
    model = GradientBoostingRegressor(n_estimators=200, max_depth=4)
    model.fit(X_train, y_train)
    mlflow.log_metric("val_mae", compute_mae(model, X_val, y_val))
    mlflow.sklearn.log_model(model, "model")
```

### 2. Feature store

**Problem:** the features a model was trained on differ from the features it sees at inference. Training-serving skew is the #1 cause of silent ML regressions.

**Solution:** a single system that computes features once and serves them to both training jobs and online inference.

**Tools:**

- [Feast](https://feast.dev/), open-source, multi-backend (Redis, DynamoDB, Postgres)
- [Tecton](https://www.tecton.ai/), commercial, the founders of Feast
- [Databricks Feature Store](https://docs.databricks.com/en/machine-learning/feature-store/index.html), native to Databricks
- [Vertex AI Feature Store](https://cloud.google.com/vertex-ai/docs/featurestore), GCP
- [SageMaker Feature Store](https://aws.amazon.com/sagemaker/feature-store/), AWS

When feature stores are overkill: small teams, few features, batch inference only. A well-tested set of feature-engineering functions shared between training and serving covers 80% of the value without the operational weight.

### 3. Model registry

**Problem:** "which model is running in prod?" should have an authoritative answer. "Promote this model to prod" should be a single action, not ten steps.

**Solution:** a registry that maps model names to versions and lifecycle stages (`None` → `Staging` → `Production` → `Archived`).

MLflow Model Registry is the simple default:

```python
result = mlflow.register_model(
    model_uri=f"runs:/{run_id}/model",
    name="visit-reranker",
)
client = mlflow.MlflowClient()
client.transition_model_version_stage(
    name="visit-reranker",
    version=result.version,
    stage="Production",
)
```

The serving layer asks the registry for the current `Production` version and loads it. Rollback is a registry transition, not a redeploy.

### 4. Serving

**Problem:** get a trained model responding to HTTP requests with predictable latency and scaling behavior.

**Three common patterns:**

| Pattern | When to use | Example |
| --- | --- | --- |
| Embedded | Small model, latency-critical, low request volume | sklearn model pickled into a Django/Flask app |
| Model server | Medium-to-large model, standard REST/gRPC interface | TorchServe, TF Serving, BentoML, NVIDIA Triton |
| Managed service | You don't want to run infra | SageMaker Endpoints, Vertex AI Online Predictions |

Serving shape for an embedded model (small, portable):

```python
# FastAPI example
from fastapi import FastAPI
import joblib
import numpy as np

app = FastAPI()
model = None

@app.on_event("startup")
def load():
    global model
    model = joblib.load("/models/current/model.pkl")

@app.post("/predict")
def predict(features: list[float]) -> dict:
    score = float(model.predict(np.array([features]))[0])
    return {"score": score}
```

Add `/healthz`, `/metrics`, request/response logging, input validation, everything a normal service has.

### 5. Monitoring

**Problem:** a model that was 92% accurate at launch can be 78% accurate six months later because the world changed. There's no exception, no error log. It just gets quietly worse.

**Solution:** monitor four things, in addition to normal service health:

- **Data drift**, has the input distribution changed? KS test, population stability index, or Evidently AI.
- **Prediction drift**, has the output distribution changed? Often easier to detect than data drift.
- **Calibration**, do predicted probabilities match observed frequencies?
- **Ground-truth latency**, how long until you find out whether a prediction was correct? Some problems have same-day ground truth; others take weeks.

**Tools:**

- [Evidently AI](https://www.evidentlyai.com/), open-source drift and quality dashboards
- [WhyLabs](https://whylabs.ai/), SaaS, fluent data observability
- [Arize](https://arize.com/), SaaS, strong on LLM observability now too
- [Fiddler](https://www.fiddler.ai/), commercial, explainability-first

Dashboards alone aren't enough. Wire drift into **alerts** that page when the PSI exceeds a threshold.

## The CI/CD dimension, CT and CI/CD/CM

Applied to ML, CI/CD fragments into three pipelines:

- **CI**, code changes. Unit tests, lint, type checks. Same as any service.
- **CT (continuous training)**, data or schedule changes. Re-run the training pipeline when fresh data arrives or on a cron. Produce a new model version; don't auto-promote.
- **CD**, deploy a *specific* model version to production. Usually a manual promotion after evaluation against a holdout set.
- **CM (continuous monitoring)**, drift and performance monitoring triggering retraining or rollbacks.

Keep CI and CT separate. A flaky code change shouldn't eat GPU hours retraining a model.

## Google's MLOps maturity model (abridged)

Google's well-known [MLOps levels](https://cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning) offer a useful gradient:

- **Level 0, manual process.** Data scientists hand models over to engineers. No automation, no monitoring. Most teams start here.
- **Level 1, ML pipeline automation.** The training pipeline is a DAG that runs on a schedule or trigger. CT is automated; CD is manual.
- **Level 2, CI/CD pipeline automation.** Training *code* changes trigger the pipeline. Model versions are promoted automatically based on evaluation metrics. Full MLOps maturity.

Most production systems live at Level 1. Level 2 requires high data volume and an experiment cadence that justifies the infrastructure.

## Infrastructure patterns

### Model artifacts as code+data

A trained model is a pickled or ONNX blob + the feature schema + the training code's commit SHA. Store all three together, not separately. The registry is the binding.

### GitOps for ML

ML deployments are GitOps too: a repo holds manifests that reference model versions. Promoting a model means bumping a tag in a Kustomize overlay, which ArgoCD picks up. Same principles as [GitOps](../gitops/); the payload is a pickle instead of a Docker image.

### Batch vs online

Not every model needs to be a REST service. Many recommendation, churn, and risk models run as nightly batch jobs, pull the data, score every row, write results to a table. Batch is easier, cheaper, and has looser latency requirements. Reach for online serving only when you need it.

### Shadow mode

A new model runs in parallel with the current one and logs predictions without affecting users. Compare the distributions, validate behavior, then cut over. Essential for high-stakes models.

## LLM ops, the new cousin

Everything above was built for classical ML (gradient boosting, random forests, small neural nets). LLMs introduce new concerns:

- **Prompt versioning**, prompts are code; treat them like it.
- **Evaluation**, LLM quality is harder to measure than a regression MAE. Use LLM-as-judge, golden datasets, and human evals.
- **Cost monitoring**, per-request cost varies with input/output tokens. Track it.
- **Retrieval**, RAG stacks have their own failure modes (index staleness, chunking drift). See the [RAG topic](../../ai/rag/).
- **Latency**, LLM latency is dominated by the provider, not your code. Build in streaming, fallback models, and circuit breakers.

Tools specifically for LLM ops: [LangSmith](https://smith.langchain.com/), [Helicone](https://www.helicone.ai/), [PromptLayer](https://promptlayer.com/), [Humanloop](https://humanloop.com/), [Braintrust](https://www.braintrust.dev/).

## Common failure modes

- **Training-serving skew.** The feature computed in training is subtly different from the one in serving. Feature store + schema validation prevents most of it.
- **Data leakage.** Features that wouldn't be available at prediction time sneak into training. Validation accuracy looks amazing; production accuracy is terrible.
- **Silent quality regression.** Accuracy drops 10% after a data-source change. Nobody notices because no alerts fire. Drift monitoring is the fix.
- **Unreproducible runs.** "What did we train two months ago?" Full reproducibility = code SHA + data hash + hyperparameters + env.
- **Model registry as filesystem.** Someone promotes a model to prod by copying a pickle file. The registry exists; it just isn't the source of truth. Enforce it via deploy pipeline.
- **Retraining without revalidation.** The retraining pipeline runs, registers a new model, autopromotes. It's worse than the current one but nobody checked. Always require evaluation against a recent holdout before promotion.
- **Feedback loops.** The model's predictions become part of the training data. Small biases amplify. Hard to detect without careful experiment design.

## Starter stack (small team)

If you're setting up MLOps from scratch on a small team:

1. **MLflow** for tracking + registry (self-hosted; file backend is fine).
2. **DVC** or **lakeFS** for dataset versioning, or just a well-structured S3 layout with version suffixes.
3. **Shared Python package** for feature engineering, no full feature store yet.
4. **FastAPI + joblib** for serving, deployed like any other service.
5. **Evidently AI** for drift monitoring, wired to Prometheus or a dashboard.
6. **A `retrain.py` script** run on a schedule, evaluate, register, *don't* autopromote.

That's a fully functional MLOps setup in one afternoon. Grow features as the pain reveals what's missing.

## References

- [Google, MLOps: Continuous delivery and automation pipelines in machine learning](https://cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning), the canonical maturity levels
- [MLflow documentation](https://mlflow.org/docs/latest/)
- [Feast, feature store](https://docs.feast.dev/)
- [Evidently AI, monitoring](https://docs.evidentlyai.com/)
- [Made With ML, MLOps course](https://madewithml.com/), practical, from-scratch walkthrough
- [Eugene Yan, applied ML writing](https://eugeneyan.com/), the go-to blog for production ML patterns
- [Chip Huyen, *Designing Machine Learning Systems*](https://www.oreilly.com/library/view/designing-machine-learning/9781098107956/), the textbook
- [ML Ops principles, ml-ops.org](https://ml-ops.org/), a solid community reference

## Related topics

- [GitOps](../gitops/), the deployment philosophy
- [ArgoCD](../argocd/), GitOps controller for model deployments
- [AI Harness Development](../../ai/harness-development/), the runtime layer for LLM systems
- [RAG](../../ai/rag/), retrieval patterns for LLM apps
