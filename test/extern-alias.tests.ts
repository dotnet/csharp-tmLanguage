/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { should } from 'chai';
import { tokenize, Token } from './utils/tokenize';

describe("Extern aliases", () => {
    before(() => { should(); });

    describe("Extern aliases", () => {
        it("declaration", async () => {

            const input = `
extern alias X;
extern alias Y;`;

            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Directive.Extern,
                Token.Keyword.Directive.Alias,
                Token.Variables.Alias("X"),
                Token.Punctuation.Semicolon,
                Token.Keyword.Directive.Extern,
                Token.Keyword.Directive.Alias,
                Token.Variables.Alias("Y"),
                Token.Punctuation.Semicolon]);
        });
    });
});