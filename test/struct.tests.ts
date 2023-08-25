/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { should } from 'chai';
import { tokenize, Token, NamespaceStyle } from './utils/tokenize';

describe("Structs", () => {
    before(() => { should(); });

    describe("Structs", () => {
        for (const namespaceStyle of [NamespaceStyle.BlockScoped, NamespaceStyle.FileScoped]) {
            const styleName = namespaceStyle == NamespaceStyle.BlockScoped
                ? "Block-Scoped"
                : "File-Scoped";

            it(`simple struct (${styleName} Namespace)`, async () => {

                const input = `struct S { }`;
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Definition.Struct,
                    Token.Identifier.StructName("S"),
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace]);
            });

            it(`struct interface implementation (${styleName} Namespace)`, async () => {

                const input = `
interface IFoo { }
struct S : IFoo { }
`;
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Definition.Interface,
                    Token.Identifier.InterfaceName("IFoo"),
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,
                    Token.Keyword.Definition.Struct,
                    Token.Identifier.StructName("S"),
                    Token.Punctuation.Colon,
                    Token.Type("IFoo"),
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace]);
            });

            it(`nested struct (${styleName} Namespace)`, async () => {

                const input = `
class Klass
{
    struct Nested
    {

    }
}`;
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Definition.Class,
                    Token.Identifier.ClassName("Klass"),
                    Token.Punctuation.OpenBrace,

                    Token.Keyword.Definition.Struct,
                    Token.Identifier.StructName("Nested"),
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,

                    Token.Punctuation.CloseBrace]);
            });

            it(`nested struct with modifier (${styleName} Namespace)`, async () => {

                const input = `
class Klass
{
    public struct Nested
    {

    }
}`;
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Definition.Class,
                    Token.Identifier.ClassName("Klass"),
                    Token.Punctuation.OpenBrace,

                    Token.Keyword.Modifier.Public,
                    Token.Keyword.Definition.Struct,
                    Token.Identifier.StructName("Nested"),
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,

                    Token.Punctuation.CloseBrace]);
            });

            it(`generic struct (${styleName} Namespace)`, async () => {

                const input = `
struct S<T1, T2> { }
`;
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Definition.Struct,
                    Token.Identifier.StructName("S"),
                    Token.Punctuation.TypeParameter.Begin,
                    Token.Identifier.TypeParameterName("T1"),
                    Token.Punctuation.Comma,
                    Token.Identifier.TypeParameterName("T2"),
                    Token.Punctuation.TypeParameter.End,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace]);
            });

            it(`generic struct with constraints (${styleName} Namespace)`, async () => {

                const input = `
struct S<T1, T2> where T1 : T2 { }
`;
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Definition.Struct,
                    Token.Identifier.StructName("S"),
                    Token.Punctuation.TypeParameter.Begin,
                    Token.Identifier.TypeParameterName("T1"),
                    Token.Punctuation.Comma,
                    Token.Identifier.TypeParameterName("T2"),
                    Token.Punctuation.TypeParameter.End,
                    Token.Keyword.Modifier.Where,
                    Token.Identifier.TypeParameterName("T1"),
                    Token.Punctuation.Colon,
                    Token.Type("T2"),
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace]);
            });

            it(`ref struct (${styleName} Namespace)`, async () => {
                const input = `ref struct S {}`;
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Modifier.Ref,
                    Token.Keyword.Definition.Struct,
                    Token.Identifier.StructName("S"),
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace]);
            });

            it(`readonly ref struct(${styleName} Namespace)`, async () => {
                const input = `readonly ref struct S {}`;
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Modifier.ReadOnly,
                    Token.Keyword.Modifier.Ref,
                    Token.Keyword.Definition.Struct,
                    Token.Identifier.StructName("S"),
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace]);
            });

            it(`primary constructor struct (${styleName} Namespace)`, async () => {

                const input = `
struct Person(string name, int age);
struct Person2(string name, int age) { } `;
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Definition.Struct,
                    Token.Identifier.StructName("Person"),
                    Token.Punctuation.OpenParen,
                    Token.PrimitiveType.String,
                    Token.Identifier.ParameterName("name"),
                    Token.Punctuation.Comma,
                    Token.PrimitiveType.Int,
                    Token.Identifier.ParameterName("age"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon,
                    Token.Keyword.Definition.Struct,
                    Token.Identifier.StructName("Person2"),
                    Token.Punctuation.OpenParen,
                    Token.PrimitiveType.String,
                    Token.Identifier.ParameterName("name"),
                    Token.Punctuation.Comma,
                    Token.PrimitiveType.Int,
                    Token.Identifier.ParameterName("age"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace]);
            });
        }
    });
});
