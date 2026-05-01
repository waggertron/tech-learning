def generate_parenthesis(n: int) -> list[str]:
    pass  # TODO: implement

def _run_tests():
    assert sorted(generate_parenthesis(1)) == ['()']
    assert sorted(generate_parenthesis(2)) == sorted(['(())', '()()'])
    assert sorted(generate_parenthesis(3)) == sorted(['((()))', '(()())', '(())()', '()(())', '()()()'])
    assert len(generate_parenthesis(4)) == 14
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
