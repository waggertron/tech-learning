from __future__ import annotations

_tree_types: dict[tuple[str, str, str], TreeType] = {}


class TreeType:
    def __init__(self, name: str, color: str, texture: str) -> None:
        self.name = name
        self.color = color
        self.texture = texture

    def draw(self, x: int, y: int) -> None:
        print(f'Drawing {self.name} ({self.color}) at ({x}, {y}) [texture: {self.texture}]')


def get_tree_type(name: str, color: str, texture: str) -> TreeType:
    key = (name, color, texture)
    if key not in _tree_types:
        _tree_types[key] = TreeType(name, color, texture)
    return _tree_types[key]


class Tree:
    def __init__(self, x: int, y: int, tree_type: TreeType) -> None:
        self._x = x
        self._y = y
        self._type = tree_type

    def draw(self) -> None:
        self._type.draw(self._x, self._y)


class Forest:
    def __init__(self) -> None:
        self._trees: list[Tree] = []

    def plant_tree(self, x: int, y: int, name: str, color: str, texture: str) -> None:
        tree_type = get_tree_type(name, color, texture)
        self._trees.append(Tree(x, y, tree_type))

    def draw(self) -> None:
        for tree in self._trees:
            tree.draw()


forest = Forest()
forest.plant_tree(10, 20, 'Oak', 'dark green', 'rough')
forest.plant_tree(30, 40, 'Oak', 'dark green', 'rough')   # reuses
forest.plant_tree(50, 60, 'Pine', 'light green', 'smooth')
forest.plant_tree(70, 80, 'Oak', 'dark green', 'rough')   # reuses

forest.draw()
print(f'TreeType instances: {len(_tree_types)}')  # 2, not 4
