/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { should } from 'chai';
import { tokenize, Input, Token, NamespaceStyle } from './utils/tokenize';

describe("Record", () => {
    before(() => { should(); });

    describe("Record", () => {
        for (const namespaceStyle of [NamespaceStyle.BlockScoped, NamespaceStyle.FileScoped]) {
            const styleName = namespaceStyle == NamespaceStyle.BlockScoped
                ? "Block-Scoped"
                : "File-Scoped";


            it(`record keyword and storage modifiers (${styleName} Namespace)`, async () => {

                const input = Input.InNamespace(`
public             record PublicRecord { }

                    record DefaultRecord { }

internal           record InternalRecord { }

            static   record DefaultStaticRecord { }

public    static   record PublicStaticRecord { }

            sealed   record DefaultSealedRecord { }

public    sealed   record PublicSealedRecord { }

public    abstract record PublicAbstractRecord { }

            abstract record DefaultAbstractRecord { }`, namespaceStyle);

                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Modifier.Public,
                    Token.Keyword.Definition.Record,
                    Token.Identifier.ClassName("PublicRecord"),
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,

                    Token.Keyword.Definition.Record,
                    Token.Identifier.ClassName("DefaultRecord"),
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,

                    Token.Keyword.Modifier.Internal,
                    Token.Keyword.Definition.Record,
                    Token.Identifier.ClassName("InternalRecord"),
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,

                    Token.Keyword.Modifier.Static,
                    Token.Keyword.Definition.Record,
                    Token.Identifier.ClassName("DefaultStaticRecord"),
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,

                    Token.Keyword.Modifier.Public,
                    Token.Keyword.Modifier.Static,
                    Token.Keyword.Definition.Record,
                    Token.Identifier.ClassName("PublicStaticRecord"),
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,

                    Token.Keyword.Modifier.Sealed,
                    Token.Keyword.Definition.Record,
                    Token.Identifier.ClassName("DefaultSealedRecord"),
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,

                    Token.Keyword.Modifier.Public,
                    Token.Keyword.Modifier.Sealed,
                    Token.Keyword.Definition.Record,
                    Token.Identifier.ClassName("PublicSealedRecord"),
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,

                    Token.Keyword.Modifier.Public,
                    Token.Keyword.Modifier.Abstract,
                    Token.Keyword.Definition.Record,
                    Token.Identifier.ClassName("PublicAbstractRecord"),
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,

                    Token.Keyword.Modifier.Abstract,
                    Token.Keyword.Definition.Record,
                    Token.Identifier.ClassName("DefaultAbstractRecord"),
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace]);
            });

            it(`generics in identifier (${styleName} Namespace)`, async () => {

                const input = Input.InNamespace(`record Dictionary<TKey, TValue> { }`, namespaceStyle);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Definition.Record,
                    Token.Identifier.ClassName("Dictionary"),
                    Token.Punctuation.TypeParameter.Begin,
                    Token.Identifier.TypeParameterName("TKey"),
                    Token.Punctuation.Comma,
                    Token.Identifier.TypeParameterName("TValue"),
                    Token.Punctuation.TypeParameter.End,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace]);
            });

            it(`inheritance (${styleName} Namespace)`, async () => {

                const input = Input.InNamespace(`
record PublicRecord    : IInterface,    IInterfaceTwo { }
record PublicRecord<T> : Root.IInterface<Something.Nested>, Something.IInterfaceTwo { }
record PublicRecord<T> : Dictionary<T, Dictionary<string, string>>, IMap<T, Dictionary<string, string>> { }`, namespaceStyle);

                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Definition.Record,
                    Token.Identifier.ClassName("PublicRecord"),
                    Token.Punctuation.Colon,
                    Token.Type("IInterface"),
                    Token.Punctuation.Comma,
                    Token.Type("IInterfaceTwo"),
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,

                    Token.Keyword.Definition.Record,
                    Token.Identifier.ClassName("PublicRecord"),
                    Token.Punctuation.TypeParameter.Begin,
                    Token.Identifier.TypeParameterName("T"),
                    Token.Punctuation.TypeParameter.End,
                    Token.Punctuation.Colon,
                    Token.Type("Root"),
                    Token.Punctuation.Accessor,
                    Token.Type("IInterface"),
                    Token.Punctuation.TypeParameter.Begin,
                    Token.Type("Something"),
                    Token.Punctuation.Accessor,
                    Token.Type("Nested"),
                    Token.Punctuation.TypeParameter.End,
                    Token.Punctuation.Comma,
                    Token.Type("Something"),
                    Token.Punctuation.Accessor,
                    Token.Type("IInterfaceTwo"),
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,

                    Token.Keyword.Definition.Record,
                    Token.Identifier.ClassName("PublicRecord"),
                    Token.Punctuation.TypeParameter.Begin,
                    Token.Identifier.TypeParameterName("T"),
                    Token.Punctuation.TypeParameter.End,
                    Token.Punctuation.Colon,
                    Token.Type("Dictionary"),
                    Token.Punctuation.TypeParameter.Begin,
                    Token.Type("T"),
                    Token.Punctuation.Comma,
                    Token.Type("Dictionary"),
                    Token.Punctuation.TypeParameter.Begin,
                    Token.PrimitiveType.String,
                    Token.Punctuation.Comma,
                    Token.PrimitiveType.String,
                    Token.Punctuation.TypeParameter.End,
                    Token.Punctuation.TypeParameter.End,
                    Token.Punctuation.Comma,
                    Token.Type("IMap"),
                    Token.Punctuation.TypeParameter.Begin,
                    Token.Type("T"),
                    Token.Punctuation.Comma,
                    Token.Type("Dictionary"),
                    Token.Punctuation.TypeParameter.Begin,
                    Token.PrimitiveType.String,
                    Token.Punctuation.Comma,
                    Token.PrimitiveType.String,
                    Token.Punctuation.TypeParameter.End,
                    Token.Punctuation.TypeParameter.End,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace]);
            });

            it(`generic constraints (${styleName} Namespace)`, async () => {

                const input = Input.InNamespace(`
record PublicRecord<T> where T : ISomething { }
record PublicRecord<T, X> : Dictionary<T, List<string>[]>, ISomething
    where T : ICar, new()
    where X : struct
{
}`, namespaceStyle);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Definition.Record,
                    Token.Identifier.ClassName("PublicRecord"),
                    Token.Punctuation.TypeParameter.Begin,
                    Token.Identifier.TypeParameterName("T"),
                    Token.Punctuation.TypeParameter.End,
                    Token.Keyword.Modifier.Where,
                    Token.Identifier.TypeParameterName("T"),
                    Token.Punctuation.Colon,
                    Token.Type("ISomething"),
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,

                    Token.Keyword.Definition.Record,
                    Token.Identifier.ClassName("PublicRecord"),
                    Token.Punctuation.TypeParameter.Begin,
                    Token.Identifier.TypeParameterName("T"),
                    Token.Punctuation.Comma,
                    Token.Identifier.TypeParameterName("X"),
                    Token.Punctuation.TypeParameter.End,
                    Token.Punctuation.Colon,
                    Token.Type("Dictionary"),
                    Token.Punctuation.TypeParameter.Begin,
                    Token.Type("T"),
                    Token.Punctuation.Comma,
                    Token.Type("List"),
                    Token.Punctuation.TypeParameter.Begin,
                    Token.PrimitiveType.String,
                    Token.Punctuation.TypeParameter.End,
                    Token.Punctuation.OpenBracket,
                    Token.Punctuation.CloseBracket,
                    Token.Punctuation.TypeParameter.End,
                    Token.Punctuation.Comma,
                    Token.Type("ISomething"),
                    Token.Keyword.Modifier.Where,
                    Token.Identifier.TypeParameterName("T"),
                    Token.Punctuation.Colon,
                    Token.Type("ICar"),
                    Token.Punctuation.Comma,
                    Token.Operator.Expression.New,
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Keyword.Modifier.Where,
                    Token.Identifier.TypeParameterName("X"),
                    Token.Punctuation.Colon,
                    Token.Keyword.Definition.Struct,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace]);
            });

            it(`nested record (${styleName} Namespace)`, async () => {

                const input = Input.InNamespace(`
record Klass
{
    record Nested
    {

    }
}`, namespaceStyle);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Definition.Record,
                    Token.Identifier.ClassName("Klass"),
                    Token.Punctuation.OpenBrace,

                    Token.Keyword.Definition.Record,
                    Token.Identifier.ClassName("Nested"),
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,

                    Token.Punctuation.CloseBrace]);
            });

            it(`nested record with modifier (${styleName} Namespace)`, async () => {

                const input = Input.InNamespace(`
record Klass
{
    public record Nested
    {

    }
}`, namespaceStyle);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Definition.Record,
                    Token.Identifier.ClassName("Klass"),
                    Token.Punctuation.OpenBrace,

                    Token.Keyword.Modifier.Public,
                    Token.Keyword.Definition.Record,
                    Token.Identifier.ClassName("Nested"),
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,

                    Token.Punctuation.CloseBrace]);
            });

            it(`unsafe record (${styleName} Namespace)`, async () => {
                const input = Input.InNamespace(`
unsafe record C
{
}`, namespaceStyle);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Modifier.Unsafe,
                    Token.Keyword.Definition.Record,
                    Token.Identifier.ClassName("C"),
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace]);
            });

            it(`primary constructor record (${styleName} Namespace)`, async () => {

                const input = Input.InNamespace(`
record Person(string name, int age);
record Person2(string name, int age) { }`
                    , namespaceStyle);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Definition.Record,
                    Token.Identifier.ClassName("Person"),
                    Token.Punctuation.OpenParen,
                    Token.PrimitiveType.String,
                    Token.Identifier.ParameterName("name"),
                    Token.Punctuation.Comma,
                    Token.PrimitiveType.Int,
                    Token.Identifier.ParameterName("age"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon,
                    Token.Keyword.Definition.Record,
                    Token.Identifier.ClassName("Person2"),
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

            it(`primary constructor record class (${styleName} Namespace)`, async () => {

                const input = Input.InNamespace(`
record class Person(string name, int age);
record class Person2(string name, int age) { }`
                    , namespaceStyle);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Definition.Record,
                    Token.Keyword.Definition.Class,
                    Token.Identifier.ClassName("Person"),
                    Token.Punctuation.OpenParen,
                    Token.PrimitiveType.String,
                    Token.Identifier.ParameterName("name"),
                    Token.Punctuation.Comma,
                    Token.PrimitiveType.Int,
                    Token.Identifier.ParameterName("age"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon,
                    Token.Keyword.Definition.Record,
                    Token.Keyword.Definition.Class,
                    Token.Identifier.ClassName("Person2"),
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

            it(`primary constructor record struct (${styleName} Namespace)`, async () => {

                const input = Input.InNamespace(`
record struct Person(string name, int age);
record struct Person2(string name, int age) { }`
                    , namespaceStyle);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Definition.Record,
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
                    Token.Keyword.Definition.Record,
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
