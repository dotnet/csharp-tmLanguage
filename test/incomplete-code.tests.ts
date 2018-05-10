/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { should } from 'chai';
import { tokenize, Input, Token } from './utils/tokenize';

describe("Grammar", () => {
    before(() => { should(); });

    describe("Incomplete code", () => {
        it("Don't eat the next lines if there isn't a semicolon (issue #15)", () => {
            const input = Input.InClass(`
private readonly string _color
public ColorTest(string white)
{
    _color = white;
}
`);

            let tokens = tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Private,
                Token.Keywords.Modifiers.ReadOnly,
                Token.PrimitiveType.String,
                Token.Identifiers.PropertyName("_color"),
                Token.Keywords.Modifiers.Public,
                Token.Identifiers.MethodName("ColorTest"),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.String,
                Token.Identifiers.ParameterName("white"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Variables.ReadWrite("_color"),
                Token.Operators.Assignment,
                Token.Variables.ReadWrite("white"),
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace
            ]);
        });
    });
});