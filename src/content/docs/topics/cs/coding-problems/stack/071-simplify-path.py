def simplify_path(path: str) -> str:
    pass  # TODO: implement

def _run_tests():
    assert simplify_path("/home/") == "/home"
    assert simplify_path("/home//foo/") == "/home/foo"
    assert simplify_path("/home/user/Documents/../Pictures") == "/home/user/Pictures"
    assert simplify_path("/../") == "/"
    assert simplify_path("/a/./b/../../c/") == "/c"
    assert simplify_path("/") == "/"
    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
