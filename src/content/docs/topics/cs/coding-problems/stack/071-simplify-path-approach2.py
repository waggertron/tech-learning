def simplify_path(path: str) -> str:
    parts = path.split("/")
    stack = []
    for part in parts:
        if not part or part == ".":
            continue
        elif part == "..":
            if stack:
                stack.pop()
        else:
            stack.append(part)
    return "/" + "/".join(stack)

assert simplify_path("/home/") == "/home"
assert simplify_path("/home//foo/") == "/home/foo"
assert simplify_path("/home/user/Documents/../Pictures") == "/home/user/Pictures"
assert simplify_path("/../") == "/"
assert simplify_path("/a/./b/../../c/") == "/c"
assert simplify_path("/") == "/"
print("all tests pass")
