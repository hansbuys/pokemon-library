class JestAssertionError extends Error {
    constructor(message: string, cause: Error) {
        super(message);
        this.stack! += "\n\nBecause: " + cause.stack;
    }
}

function wrapMatcher<T>(matcher: any, failMessage?: string): any {
    return (...args: any[]) => {
        try {
            return matcher(...args);
        } catch (error) {
            if (failMessage)
                throw new JestAssertionError(failMessage, error);
            else
                throw error;
        }
    };
}

function wrapMatchers<T>(matchers: any, failMessage?: string): jest.JestMatchers<T> {
    return Object.keys(matchers).reduce<jest.JestMatchers<T>>((acc, name) => {
        const matcher = matchers[name];

        if (typeof matcher === 'function') {
            return {
                ...acc,
                [name]: wrapMatcher(matcher, failMessage)
            };
        }

        return {
            ...acc,
            [name]: wrapMatchers(matcher, failMessage) // recurse on .not/.resolves/.rejects
        };
    }, matchers);
}

export function wrapExpect() {
    // proxy the expect function
    let expectProxy = Object.assign(
        // partially apply expect to get all matchers and chain them
        (actual: any, failMessage?: string) => wrapMatchers(expect(actual), failMessage),
        expect
    );

    expectProxy.extend = (o: jest.ExpectExtendMap) => {
        expect.extend(o); // add new matchers to expect
        expectProxy = Object.assign(expectProxy, expect); // clone new asymmetric matchers
    };

    return expectProxy;
}