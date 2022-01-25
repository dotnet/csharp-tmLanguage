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

            static   class DefaultStaticClass { }

public    static   class PublicStaticClass { }

            sealed   class DefaultSealedClass { }

public    sealed   class PublicSealedClass { }

public    abstract class PublicAbstractClass { }

            abstract class DefaultAbstractClass { }`, namespaceStyle);

                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keywords.Modifiers.Public,
                    Token.Keywords.Class,
                    Token.Identifiers.ClassName("PublicClass"),
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,

                    Token.Keywords.Class,
                    Token.Identifiers.ClassName("DefaultClass"),
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,

                    Token.Keywords.Modifiers.Internal,
                    Token.Keywords.Class,
                    Token.Identifiers.ClassName("InternalClass"),
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,

                    Token.Keywords.Modifiers.Static,
                    Token.Keywords.Class,
                    Token.Identifiers.ClassName("DefaultStaticClass"),
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,

                    Token.Keywords.Modifiers.Public,
                    Token.Keywords.Modifiers.Static,
                    Token.Keywords.Class,
                    Token.Identifiers.ClassName("PublicStaticClass"),
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,

                    Token.Keywords.Modifiers.Sealed,
                    Token.Keywords.Class,
                    Token.Identifiers.ClassName("DefaultSealedClass"),
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,

                    Token.Keywords.Modifiers.Public,
                    Token.Keywords.Modifiers.Sealed,
                    Token.Keywords.Class,
                    Token.Identifiers.ClassName("PublicSealedClass"),
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,

                    Token.Keywords.Modifiers.Public,
                    Token.Keywords.Modifiers.Abstract,
                    Token.Keywords.Class,
                    Token.Identifiers.ClassName("PublicAbstractClass"),
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,

                    Token.Keywords.Modifiers.Abstract,
                    Token.Keywords.Class,
                    Token.Identifiers.ClassName("DefaultAbstractClass"),
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace]);
            });

            it(`generics in identifier (${styleName} Namespace)`, async () => {

                const input = Input.InNamespace(`class Dictionary<TKey, TValue> { }`, namespaceStyle);
                const tokens = await tokenize(input);

                tokens.should.deep.equal([
                    Token.Keywords.Class,
                    Token.Identifiers.ClassName("Dictionary"),
                    Token.Punctuation.TypeParameters.Begin,
                    Token.Identifiers.TypeParameterName("TKey"),
                    Token.Punctuation.Comma,
                    Token.Identifiers.TypeParameterName("TValue"),
                    Token.Punctuation.TypeParameters.End,
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
                    Token.Keywords.Class,
                    Token.Identifiers.ClassName("PublicClass"),
                    Token.Punctuation.Colon,
                    Token.Type("IInterface"),
                    Token.Punctuation.Comma,
                    Token.Type("IInterfaceTwo"),
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,

                    Token.Keywords.Class,
                    Token.Identifiers.ClassName("PublicClass"),
                    Token.Punctuation.TypeParameters.Begin,
                    Token.Identifiers.TypeParameterName("T"),
                    Token.Punctuation.TypeParameters.End,
                    Token.Punctuation.Colon,
                    Token.Type("Root"),
                    Token.Punctuation.Accessor,
                    Token.Type("IInterface"),
                    Token.Punctuation.TypeParameters.Begin,
                    Token.Type("Something"),
                    Token.Punctuation.Accessor,
                    Token.Type("Nested"),
                    Token.Punctuation.TypeParameters.End,
                    Token.Punctuation.Comma,
                    Token.Type("Something"),
                    Token.Punctuation.Accessor,
                    Token.Type("IInterfaceTwo"),
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,

                    Token.Keywords.Class,
                    Token.Identifiers.ClassName("PublicClass"),
                    Token.Punctuation.TypeParameters.Begin,
                    Token.Identifiers.TypeParameterName("T"),
                    Token.Punctuation.TypeParameters.End,
                    Token.Punctuation.Colon,
                    Token.Type("Dictionary"),
                    Token.Punctuation.TypeParameters.Begin,
                    Token.Type("T"),
                    Token.Punctuation.Comma,
                    Token.Type("Dictionary"),
                    Token.Punctuation.TypeParameters.Begin,
                    Token.PrimitiveType.String,
                    Token.Punctuation.Comma,
                    Token.PrimitiveType.String,
                    Token.Punctuation.TypeParameters.End,
                    Token.Punctuation.TypeParameters.End,
                    Token.Punctuation.Comma,
                    Token.Type("IMap"),
                    Token.Punctuation.TypeParameters.Begin,
                    Token.Type("T"),
                    Token.Punctuation.Comma,
                    Token.Type("Dictionary"),
                    Token.Punctuation.TypeParameters.Begin,
                    Token.PrimitiveType.String,
                    Token.Punctuation.Comma,
                    Token.PrimitiveType.String,
                    Token.Punctuation.TypeParameters.End,
                    Token.Punctuation.TypeParameters.End,
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
                    Token.Keywords.Class,
                    Token.Identifiers.ClassName("PublicClass"),
                    Token.Punctuation.TypeParameters.Begin,
                    Token.Identifiers.TypeParameterName("T"),
                    Token.Punctuation.TypeParameters.End,
                    Token.Keywords.Where,
                    Token.Identifiers.TypeParameterName("T"),
                    Token.Punctuation.Colon,
                    Token.Type("ISomething"),
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace,

                    Token.Keywords.Class,
                    Token.Identifiers.ClassName("PublicClass"),
                    Token.Punctuation.TypeParameters.Begin,
                    Token.Identifiers.TypeParameterName("T"),
                    Token.Punctuation.Comma,
                    Token.Identifiers.TypeParameterName("X"),
                    Token.Punctuation.TypeParameters.End,
                    Token.Punctuation.Colon,
                    Token.Type("Dictionary"),
                    Token.Punctuation.TypeParameters.Begin,
                    Token.Type("T"),
                    Token.Punctuation.Comma,
                    Token.Type("List"),
                    Token.Punctuation.TypeParameters.Begin,
                    Token.PrimitiveType.String,
                    Token.Punctuation.TypeParameters.End,
                    Token.Punctuation.OpenBracket,
                    Token.Punctuation.CloseBracket,
                    Token.Punctuation.TypeParameters.End,
                    Token.Punctuation.Comma,
                    Token.Type("ISomething"),
                    Token.Keywords.Where,
                    Token.Identifiers.TypeParameterName("T"),
                    Token.Punctuation.Colon,
                    Token.Type("ICar"),
                    Token.Punctuation.Comma,
                    Token.Keywords.New,
                    Token.Punctuation.OpenParen,
                    Token.Punctuation.CloseParen,
                    Token.Keywords.Where,
                    Token.Identifiers.TypeParameterName("X"),
                    Token.Punctuation.Colon,
                    Token.Keywords.Struct,
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
                    Token.Keywords.Class,
                    Token.Identifiers.ClassName("Klass"),
                    Token.Punctuation.OpenBrace,

                    Token.Keywords.Class,
                    Token.Identifiers.ClassName("Nested"),
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
                    Token.Keywords.Class,
                    Token.Identifiers.ClassName("Klass"),
                    Token.Punctuation.OpenBrace,

                    Token.Keywords.Modifiers.Public,
                    Token.Keywords.Class,
                    Token.Identifiers.ClassName("Nested"),
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
                    Token.Keywords.Modifiers.Unsafe,
                    Token.Keywords.Class,
                    Token.Identifiers.ClassName("C"),
                    Token.Punctuation.OpenBrace,
                    Token.Punctuation.CloseBrace]);
            });
        }
    });
});
