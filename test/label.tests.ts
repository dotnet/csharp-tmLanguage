/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { should } from 'chai';
import { tokenize, Input, Token } from './utils/tokenize';

describe("Labels", () => {
    before(() => { should(); });

    describe("Labels", () => {
        it("declaration", async () => {
            const input = Input.InMethod(`Foo:`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Identifier.LabelName("Foo"),
                Token.Punctuation.Colon
            ]);
        });
    });
});