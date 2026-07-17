let matchingTagCount = 3
let pointsPerTag = 12
let freshness = 0.75
let maximumFreshnessBonus = 20.0

let tagPoints = matchingTagCount * pointsPerTag
let rawScore = Double(tagPoints) + freshness * maximumFreshnessBonus
let roundedScore = Int(rawScore.rounded())
let boundedScore = min(max(roundedScore, 0), 100)
let relevance = UInt8(boundedScore)

precondition(relevance <= 100)

let wrappingExample = UInt8.max &+ 1

print("Relevance: \(relevance)/100")
print("UInt8.max &+ 1: \(wrappingExample)")
