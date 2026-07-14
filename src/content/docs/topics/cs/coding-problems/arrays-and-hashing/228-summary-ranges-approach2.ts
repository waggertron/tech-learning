function assert(condition: boolean, message: string): void {
    if (!condition) throw new Error(message);
}

function equal(actual: string[], expected: string[]): boolean {
    return JSON.stringify(actual) === JSON.stringify(expected);
}

function summaryRanges(nums: number[]): string[] {
    if (nums.length === 0) return [];

    const ranges: string[] = [];
    let start = nums[0];

    for (let i = 1; i <= nums.length; i++) {
        if (i < nums.length && nums[i] === nums[i - 1] + 1) continue;

        const end = nums[i - 1];
        ranges.push(start === end ? `${start}` : `${start}->${end}`);

        if (i < nums.length) start = nums[i];
    }

    return ranges;
}

function runTests(): void {
    assert(equal(summaryRanges([0, 1, 2, 4, 5, 7]), ["0->2", "4->5", "7"]), "example 1");
    assert(equal(summaryRanges([0, 2, 3, 4, 6, 8, 9]), ["0", "2->4", "6", "8->9"]), "example 2");
    assert(equal(summaryRanges([]), []), "empty input");
    assert(equal(summaryRanges([5]), ["5"]), "singleton");
    assert(equal(summaryRanges([-3, -2, -1, 1, 3, 4]), ["-3->-1", "1", "3->4"]), "negative values");

    const minimum = -(2 ** 31);
    const maximum = 2 ** 31 - 1;
    assert(
        equal(
            summaryRanges([minimum, minimum + 1, -1, 0, 1, maximum]),
            [`${minimum}->${minimum + 1}`, "-1->1", `${maximum}`],
        ),
        "32-bit boundaries",
    );

    assert(equal(summaryRanges(Array.from({ length: 20 }, (_, i) => i - 10)), ["-10->9"]), "maximum length");
    console.log("all tests pass");
}

runTests();
