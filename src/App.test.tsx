import React from 'react';
import {render} from '@testing-library/react';
import App from './App';

test('Contains a header', () => {
    const {getByText} = render(<App/>);
    const linkElement = getByText(/Pokemon Library/);
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveClass("header")
});
