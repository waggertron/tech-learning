// SWIFT_CATALOG_HELPER: GraphNode
final class Node {
    var val: Int
    var neighbors: [Node?]

    init(_ val: Int = 0, _ neighbors: [Node?] = []) {
        self.val = val
        self.neighbors = neighbors
    }
}
