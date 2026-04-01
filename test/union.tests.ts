/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { should } from 'chai';
import { tokenize, Input, Token, NamespaceStyle } from './utils/tokenize';

describe("Union", () => {
    before(() => { should(); });

    describe("Union declarations", () => {
        for (const namespaceStyle of [NamespaceStyle.BlockScoped, NamespaceStyle.FileScoped]) {
            const styleName = namespaceStyle === NamespaceStyle.BlockScoped
                ? "Block-Scoped"
                : "File-Scoped";

            it(`simple union (${styleName} Namespace)`, async () => {
                const input = Input.InNamespace(`union Result(int, string);`, namespaceStyle);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Definition.Union,
                    Token.Identifier.UnionName("Result"),
                    Token.Punctuation.OpenParen,
                    Token.PrimitiveType.Int,
                    Token.Punctuation.Comma,
                    Token.PrimitiveType.String,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon]);
            });

            it(`generic union with interfaces and constraints (${styleName} Namespace)`, async () => {
                const input = Input.InNamespace(`
union Result<T>(T, string) : IResult<T>, IDisposable
    where T : struct
{
}`, namespaceStyle);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Definition.Union,
                    Token.Identifier.UnionName("Result"),
                    Token.Punctuation.TypeParameter.Begin,
                    Token.Identifier.TypeParameterName("T"),
                    Token.Punctuation.TypeParameter.End,
                    Token.Punctuation.OpenParen,
                    Token.Type("T"),
                    Token.Punctuation.Comma,
                    Token.PrimitiveType.String,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Colon,
                    Token.Type("IResult"),
                    Token.Punctuation.TypeParameter.Begin,
                    Token.Type("T"),
                    Token.Punctuation.TypeParameter.End,
                    Token.Punctuation.Comma,
                    Token.Type("IDisposable"),
                    Token.Keyword.Modifier.Where,
                    Token.Identifier.TypeParameterName("T"),
                    Token.Punctuation.Colon,
                    Token.Keyword.Definition.Struct,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace]);
            });

            it(`nested union with members (${styleName} Namespace)`, async () => {
                const input = Input.InNamespace(`
class Container
{
    public union Payload(int, string)
    {
        public int Value;
    }
}`, namespaceStyle);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Definition.Class,
                    Token.Identifier.ClassName("Container"),
                    Token.Punctuation.OpenBrace,

                    Token.Keyword.Modifier.Public,
                    Token.Keyword.Definition.Union,
                    Token.Identifier.UnionName("Payload"),
                    Token.Punctuation.OpenParen,
                    Token.PrimitiveType.Int,
                    Token.Punctuation.Comma,
                    Token.PrimitiveType.String,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.OpenBrace,

                    Token.Keyword.Modifier.Public,
                    Token.PrimitiveType.Int,
                    Token.Identifier.FieldName("Value"),
                    Token.Punctuation.Semicolon,

                    Token.Punctuation.CloseBrace,
                    Token.Punctuation.CloseBrace]);
            });
        }
    });
});
