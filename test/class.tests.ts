/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { should } from 'chai';
import { tokenize, Input, Token, NamespaceStyle } from './utils/tokenize';

describe("Class", () => {
    before(() => { should(); });

    describe("Class", () => {
        for (const namespaceStyle of [NamespaceStyle.BlockScoped, NamespaceStyle.FileScoped]) {
            const styleName = namespaceStyle == NamespaceStyle.BlockScoped
                ? "Block-Scoped"
                : "File-Scoped";

            it(`class keyword and storage modifiers (${styleName} Namespace)`, async () => {

                const input = Input.InNamespace(`
public             class PublicClass { }

                    class DefaultClass { }

internal           class InternalClass { }

     file          class DefaultFileLocalClass { }

public   file      class PublicFileLocalClass { }

            static   class DefaultStaticClass { }

public    static   class PublicStaticClass { }

            sealed   class DefaultSealedClass { }

public    sealed   class PublicSealedClass { }

public    abstract class PublicAbstractClass { }

            abstract class DefaultAbstractClass { }`, namespaceStyle);

                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Modifier.Public,
                    Token.Keyword.Definition.Class,
                    Token.Identifier.ClassName("PublicClass"),
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,

                    Token.Keyword.Definition.Class,
                    Token.Identifier.ClassName("DefaultClass"),
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,

                    Token.Keyword.Modifier.Internal,
                    Token.Keyword.Definition.Class,
                    Token.Identifier.ClassName("InternalClass"),
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,

                    Token.Keyword.Modifier.File,
                    Token.Keyword.Definition.Class,
                    Token.Identifier.ClassName("DefaultFileLocalClass"),
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,

                    Token.Keyword.Modifier.Public,
                    Token.Keyword.Modifier.File,
                    Token.Keyword.Definition.Class,
                    Token.Identifier.ClassName("PublicFileLocalClass"),
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,

                    Token.Keyword.Modifier.Static,
                    Token.Keyword.Definition.Class,
                    Token.Identifier.ClassName("DefaultStaticClass"),
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,

                    Token.Keyword.Modifier.Public,
                    Token.Keyword.Modifier.Static,
                    Token.Keyword.Definition.Class,
                    Token.Identifier.ClassName("PublicStaticClass"),
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,

                    Token.Keyword.Modifier.Sealed,
                    Token.Keyword.Definition.Class,
                    Token.Identifier.ClassName("DefaultSealedClass"),
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,

                    Token.Keyword.Modifier.Public,
                    Token.Keyword.Modifier.Sealed,
                    Token.Keyword.Definition.Class,
                    Token.Identifier.ClassName("PublicSealedClass"),
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,

                    Token.Keyword.Modifier.Public,
                    Token.Keyword.Modifier.Abstract,
                    Token.Keyword.Definition.Class,
                    Token.Identifier.ClassName("PublicAbstractClass"),
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,

                    Token.Keyword.Modifier.Abstract,
                    Token.Keyword.Definition.Class,
                    Token.Identifier.ClassName("DefaultAbstractClass"),
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace]);
            });

            it(`generics in identifier (${styleName} Namespace)`, async () => {

                const input = Input.InNamespace(`class Dictionary<TKey, TValue> { }`, namespaceStyle);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Definition.Class,
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
class PublicClass    : IInterface,    IInterfaceTwo { }
class PublicClass<T> : Root.IInterface<Something.Nested>, Something.IInterfaceTwo { }
class PublicClass<T> : Dictionary<T, Dictionary<string, string>>, IMap<T, Dictionary<string, string>> { }`, namespaceStyle);

                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Definition.Class,
                    Token.Identifier.ClassName("PublicClass"),
                    Token.Punctuation.Colon,
                    Token.Type("IInterface"),
                    Token.Punctuation.Comma,
                    Token.Type("IInterfaceTwo"),
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,

                    Token.Keyword.Definition.Class,
                    Token.Identifier.ClassName("PublicClass"),
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

                    Token.Keyword.Definition.Class,
                    Token.Identifier.ClassName("PublicClass"),
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
class PublicClass<T> where T : ISomething { }
class PublicClass<T, X> : Dictionary<T, List<string>[]>, ISomething
    where T : ICar, new()
    where X : struct
{
}`, namespaceStyle);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Definition.Class,
                    Token.Identifier.ClassName("PublicClass"),
                    Token.Punctuation.TypeParameter.Begin,
                    Token.Identifier.TypeParameterName("T"),
                    Token.Punctuation.TypeParameter.End,
                    Token.Keyword.Modifier.Where,
                    Token.Identifier.TypeParameterName("T"),
                    Token.Punctuation.Colon,
                    Token.Type("ISomething"),
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,

                    Token.Keyword.Definition.Class,
                    Token.Identifier.ClassName("PublicClass"),
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

            it(`nested class (${styleName} Namespace)`, async () => {

                const input = Input.InNamespace(`
class Klass
{
    class Nested
    {

    }
}`, namespaceStyle);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Definition.Class,
                    Token.Identifier.ClassName("Klass"),
                    Token.Punctuation.OpenBrace,

                    Token.Keyword.Definition.Class,
                    Token.Identifier.ClassName("Nested"),
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,

                    Token.Punctuation.CloseBrace]);
            });

            it(`nested class with modifier (${styleName} Namespace)`, async () => {

                const input = Input.InNamespace(`
class Klass
{
    public class Nested
    {

    }
}`, namespaceStyle);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Definition.Class,
                    Token.Identifier.ClassName("Klass"),
                    Token.Punctuation.OpenBrace,

                    Token.Keyword.Modifier.Public,
                    Token.Keyword.Definition.Class,
                    Token.Identifier.ClassName("Nested"),
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,

                    Token.Punctuation.CloseBrace]);
            });

            it(`unsafe class (${styleName} Namespace)`, async () => {
                const input = Input.InNamespace(`
unsafe class C
{
}`, namespaceStyle);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Modifier.Unsafe,
                    Token.Keyword.Definition.Class,
                    Token.Identifier.ClassName("C"),
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace]);
            });

            it(`primary constructor (${styleName} Namespace)`, async () => {

                const input = Input.InNamespace(`
class Person(string name, int age);
class Person2(string name, int age) { }`
                    , namespaceStyle);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
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

            it(`primary constructor inheritance (${styleName} Namespace)`, async () => {

                const input = Input.InNamespace(`
class Person(string name, int age) : IPerson;
class Person2(string name, int age) : IPerson { }`
                    , namespaceStyle);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Definition.Class,
                    Token.Identifier.ClassName("Person"),
                    Token.Punctuation.OpenParen,
                    Token.PrimitiveType.String,
                    Token.Identifier.ParameterName("name"),
                    Token.Punctuation.Comma,
                    Token.PrimitiveType.Int,
                    Token.Identifier.ParameterName("age"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Colon,
                    Token.Type("IPerson"),
                    Token.Punctuation.Semicolon,
                    Token.Keyword.Definition.Class,
                    Token.Identifier.ClassName("Person2"),
                    Token.Punctuation.OpenParen,
                    Token.PrimitiveType.String,
                    Token.Identifier.ParameterName("name"),
                    Token.Punctuation.Comma,
                    Token.PrimitiveType.Int,
                    Token.Identifier.ParameterName("age"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Colon,
                    Token.Type("IPerson"),
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace]);
            });

            it(`primary constructor generic (${styleName} Namespace)`, async () => {

                const input = Input.InNamespace(`
class Person<T>(string name, int age, T tag) : IPerson
    where T : new();
class Person2<T>(string name, int age, T tag) : IPerson
    where T : new() { }`
                    , namespaceStyle);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keyword.Definition.Class,
                    Token.Identifier.ClassName("Person"),
                    Token.Punctuation.TypeParameter.Begin,
                    Token.Identifier.TypeParameterName("T"),
                    Token.Punctuation.TypeParameter.End,
                    Token.Punctuation.OpenParen,
                    Token.PrimitiveType.String,
                    Token.Identifier.ParameterName("name"),
                    Token.Punctuation.Comma,
                    Token.PrimitiveType.Int,
                    Token.Identifier.ParameterName("age"),
                    Token.Punctuation.Comma,
                    Token.Type("T"),
                    Token.Identifier.ParameterName("tag"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Colon,
                    Token.Type("IPerson"),
                    Token.Keyword.Modifier.Where,
                    Token.Identifier.TypeParameterName("T"),
                    Token.Punctuation.Colon,
                    Token.Operator.Expression.New,
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Semicolon,
                    Token.Keyword.Definition.Class,
                    Token.Identifier.ClassName("Person2"),
                    Token.Punctuation.TypeParameter.Begin,
                    Token.Identifier.TypeParameterName("T"),
                    Token.Punctuation.TypeParameter.End,
                    Token.Punctuation.OpenParen,
                    Token.PrimitiveType.String,
                    Token.Identifier.ParameterName("name"),
                    Token.Punctuation.Comma,
                    Token.PrimitiveType.Int,
                    Token.Identifier.ParameterName("age"),
                    Token.Punctuation.Comma,
                    Token.Type("T"),
                    Token.Identifier.ParameterName("tag"),
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.Colon,
                    Token.Type("IPerson"),
                    Token.Keyword.Modifier.Where,
                    Token.Identifier.TypeParameterName("T"),
                    Token.Punctuation.Colon,
                    Token.Operator.Expression.New,
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace]);
            });
        }
    });
});
