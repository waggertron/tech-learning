let title = "Fog over the north ridge"
let capturedAt: String = "2026-07-16T07:30:00-07:00"
var rating = 3
var isFavorite: Bool = false

rating += 1
isFavorite = rating >= 4

precondition((1...5).contains(rating))

let summary = "\(title) | \(capturedAt) | rating \(rating)/5 | favorite \(isFavorite)"
print(summary)
