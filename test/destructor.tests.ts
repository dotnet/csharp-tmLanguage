/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { should } from 'chai';
import { tokenize, Input, Token } from './utils/tokenize';

describe("Destructor", () => {
    before(() => { should(); });

    describe("Destructor", () => {
        it("declaration", async () => {

            const input = Input.InClass(`~TestClass() { }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Tilde,
                Token.Identifiers.MethodName("TestClass"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("with expression body", async () => {

            const input = Input.InClass(`~TestClass() => Foo();`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.Tilde,
                Token.Identifiers.MethodName("TestClass"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Operators.Arrow,
                Token.Identifiers.MethodName("Foo"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.Semicolon]);
        });
    });
});