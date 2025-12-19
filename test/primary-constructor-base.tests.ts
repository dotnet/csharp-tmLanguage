/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { should } from 'chai';
import { tokenize, Input, Token } from './utils/tokenize';

describe("Primary Constructor Base Arguments", () => {
    before(() => { should(); });

    it(`primary constructor with base class arguments`, async () => {

        const input = Input.InClass(`
class Derived(string name) : Base(name) { }
class Bar(Action action) : Base(() => {}) { }`);
        const tokens = await tokenize(input);

        // This test will identify the current tokenization
        console.log(JSON.stringify(tokens.slice(0, 30), null, 2));
    });
});
