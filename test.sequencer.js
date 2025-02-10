class CustomSequencer {
    async sort(tests) {
        const unitTests = tests.filter(test => test.path.includes('__tests__'));
        const e2eTests = tests.filter(test => test.path.includes('e2e'));

        return [...unitTests, ...e2eTests];
    }

    cacheResults() {
        return [];
    }
}

module.exports = CustomSequencer;
