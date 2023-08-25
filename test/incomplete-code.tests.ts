/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { should } from 'chai';
import { tokenize, Input, Token } from './utils/tokenize';

describe("Incomplete code", () => {
    before(() => { should(); });

    describe("Incomplete code", () => {
        it("Don't eat the next lines if there isn't a semicolon (issue #15)", async () => {
            const input = Input.InClass(`
private readonly string _color
public ColorTest(string white)
{
    _color = white;
}
`);

            let tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Private,
                Token.Keyword.Modifier.ReadOnly,
                Token.PrimitiveType.String,
                Token.Identifier.PropertyName("_color"),
                Token.Keyword.Modifier.Public,
                Token.Identifier.MethodName("ColorTest"),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.String,
                Token.Identifier.ParameterName("white"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Variable.ReadWrite("_color"),
                Token.Operator.Assignment,
                Token.Variable.ReadWrite("white"),
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace
            ]);
        });
    });
});