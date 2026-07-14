// SWIFT_CATALOG_HELPER: RandomListNode
final class Node {
    var val: Int
    var next: Node?
    var random: Node?

    init(_ val: Int = 0, _ next: Node? = nil, _ random: Node? = nil) {
        self.val = val
        self.next = next
        self.random = random
    }
}
