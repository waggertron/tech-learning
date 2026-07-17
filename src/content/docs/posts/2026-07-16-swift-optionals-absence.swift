func parseCoordinate(_ input: String?) -> (latitude: Double, longitude: Double)? {
    guard let input else { return nil }

    let parts = input.split(separator: ",", omittingEmptySubsequences: false)
    guard parts.count == 2 else { return nil }

    guard let latitude = Double(parts[0]),
          let longitude = Double(parts[1]) else {
        return nil
    }

    guard (-90.0...90.0).contains(latitude),
          (-180.0...180.0).contains(longitude) else {
        return nil
    }

    return (latitude, longitude)
}

let rawCoordinate: String? = "37.7749,-122.4194"
let inputLength = rawCoordinate?.count ?? 0
print("Input characters: \(inputLength)")

if let coordinate = parseCoordinate(rawCoordinate) {
    print("Coordinate: \(coordinate.latitude), \(coordinate.longitude)")
} else {
    print("Coordinate unavailable")
}

let missingCoordinate = parseCoordinate(nil)
let missingLabel = missingCoordinate == nil ? "not available" : "available"
print("Missing input: \(missingLabel)")

precondition(inputLength == 17)
precondition(missingCoordinate == nil)
