// SWIFT_CATALOG_HELPER: Interval
struct Interval: Equatable {
    var start: Int
    var end: Int

    init(_ start: Int, _ end: Int) {
        self.start = start
        self.end = end
    }
}
