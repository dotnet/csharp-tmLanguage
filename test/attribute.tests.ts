/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { should } from 'chai';
import { tokenize, Token } from './utils/tokenize';

describe("Attributes", () => {
    before(() => { should(); });

    describe("Attributes", () => {
        it("global attribute", async () => {

            const input = `[Foo]`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.OpenBracket,
                Token.Type("Foo"),
                Token.Punctuation.CloseBracket]);
        });

        it("global attribute with specifier", async () => {

            const input = `[assembly: Foo]`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.OpenBracket,
                Token.Keyword.AttributeSpecifier("assembly"),
                Token.Punctuation.Colon,
                Token.Type("Foo"),
                Token.Punctuation.CloseBracket]);
        });

        it("Two global attributes in same section with specifier", async () => {

            const input = `[module: Foo, Bar]`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.OpenBracket,
                Token.Keyword.AttributeSpecifier("module"),
                Token.Punctuation.Colon,
                Token.Type("Foo"),
                Token.Punctuation.Comma,
                Token.Type("Bar"),
                Token.Punctuation.CloseBracket]);
        });

        it("Two global attributes in same section with specifier and empty argument lists", async () => {

            const input = `[module: Foo(), Bar()]`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.OpenBracket,
                Token.Keyword.AttributeSpecifier("module"),
                Token.Punctuation.Colon,
                Token.Type("Foo"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.Comma,
                Token.Type("Bar"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.CloseBracket]);
        });

        it("Global attribute with one argument", async () => {

            const input = `[Foo(true)]`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.OpenBracket,
                Token.Type("Foo"),
                Token.Punctuation.OpenParen,
                Token.Literal.Boolean.True,
                Token.Punctuation.CloseParen,
                Token.Punctuation.CloseBracket]);
        });

        it("Global attribute with two arguments", async () => {

            const input = `[Foo(true, 42)]`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.OpenBracket,
                Token.Type("Foo"),
                Token.Punctuation.OpenParen,
                Token.Literal.Boolean.True,
                Token.Punctuation.Comma,
                Token.Literal.Numeric.Decimal("42"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.CloseBracket]);
        });

        it("Global attribute with three arguments", async () => {

            const input = `[Foo(true, 42, "text")]`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.OpenBracket,
                Token.Type("Foo"),
                Token.Punctuation.OpenParen,
                Token.Literal.Boolean.True,
                Token.Punctuation.Comma,
                Token.Literal.Numeric.Decimal("42"),
                Token.Punctuation.Comma,
                Token.Punctuation.String.Begin,
                Token.Literal.String("text"),
                Token.Punctuation.String.End,
                Token.Punctuation.CloseParen,
                Token.Punctuation.CloseBracket]);
        });

        it("Global attribute with named argument", async () => {

            const input = `[Foo(Bar = 42)]`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.OpenBracket,
                Token.Type("Foo"),
                Token.Punctuation.OpenParen,
                Token.Identifier.PropertyName("Bar"),
                Token.Operator.Assignment,
                Token.Literal.Numeric.Decimal("42"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.CloseBracket]);
        });

        it("Global attribute with one positional argument and one named argument", async () => {

            const input = `[Foo(true, Bar = 42)]`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.OpenBracket,
                Token.Type("Foo"),
                Token.Punctuation.OpenParen,
                Token.Literal.Boolean.True,
                Token.Punctuation.Comma,
                Token.Identifier.PropertyName("Bar"),
                Token.Operator.Assignment,
                Token.Literal.Numeric.Decimal("42"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.CloseBracket]);
        });

        it("Global attribute with specifier, one positional argument, and two named arguments", async () => {

            const input = `[module: Foo(true, Bar = 42, Baz = "hello")]`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.OpenBracket,
                Token.Keyword.AttributeSpecifier("module"),
                Token.Punctuation.Colon,
                Token.Type("Foo"),
                Token.Punctuation.OpenParen,
                Token.Literal.Boolean.True,
                Token.Punctuation.Comma,
                Token.Identifier.PropertyName("Bar"),
                Token.Operator.Assignment,
                Token.Literal.Numeric.Decimal("42"),
                Token.Punctuation.Comma,
                Token.Identifier.PropertyName("Baz"),
                Token.Operator.Assignment,
                Token.Punctuation.String.Begin,
                Token.Literal.String("hello"),
                Token.Punctuation.String.End,
                Token.Punctuation.CloseParen,
                Token.Punctuation.CloseBracket]);
        });

        it("Generic attributes should be highlighted single type parameter", async () => {
                
                const input = `[Foo<T1>]`;
                const tokens = await tokenize(input);
    
                tokens.should.deep.equal([
                    Token.Punctuation.OpenBracket,
                    Token.Type("Foo"),
                    Token.Punctuation.TypeParameter.Begin,
                    Token.Type("T1"),
                    Token.Punctuation.TypeParameter.End,
                    Token.Punctuation.CloseBracket]);
        });

        it("Generic attributes should be highlighted multiple type parameters", async () => {
                
                const input = `[Foo<T1, T2>]`;
                const tokens = await tokenize(input);
    
                tokens.should.deep.equal([
                    Token.Punctuation.OpenBracket,
                    Token.Type("Foo"),
                    Token.Punctuation.TypeParameter.Begin,
                    Token.Type("T1"),
                    Token.Punctuation.Comma,
                    Token.Type("T2"),
                    Token.Punctuation.TypeParameter.End,
                    Token.Punctuation.CloseBracket]);
        });

        it("Generic attributes should be highlighted multiple type parameters with regular arguments", async () => {
                
                const input = `[Foo<T1, T2>(true)]`;
                const tokens = await tokenize(input);
    
                tokens.should.deep.equal([
                    Token.Punctuation.OpenBracket,
                    Token.Type("Foo"),
                    Token.Punctuation.TypeParameter.Begin,
                    Token.Type("T1"),
                    Token.Punctuation.Comma,
                    Token.Type("T2"),
                    Token.Punctuation.TypeParameter.End,
                    Token.Punctuation.OpenParen,
                    Token.Literal.Boolean.True,
                    Token.Punctuation.CloseParen,
                    Token.Punctuation.CloseBracket]);
        });

        it("Generic attributes should be highlighted empty", async () => {
                
                const input = `[Foo<>]`;
                const tokens = await tokenize(input);
    
                tokens.should.deep.equal([
                    Token.Punctuation.OpenBracket,
                    Token.Type("Foo"),
                    Token.Punctuation.TypeParameter.Begin,
                    Token.Punctuation.TypeParameter.End,
                    Token.Punctuation.CloseBracket]);
        });

        it("Generic attributes should be highlighted empty with comma", async () => {
                
                const input = `[Foo<,>]`;
                const tokens = await tokenize(input);
    
                tokens.should.deep.equal([
                    Token.Punctuation.OpenBracket,
                    Token.Type("Foo"),
                    Token.Punctuation.TypeParameter.Begin,
                    Token.Punctuation.Comma,
                    Token.Punctuation.TypeParameter.End,
                    Token.Punctuation.CloseBracket]);
        });

        it("typevar attribute specifier", async () => {

            const input = `[typevar: MyAttribute]`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.OpenBracket,
                Token.Keyword.AttributeSpecifier("typevar"),
                Token.Punctuation.Colon,
                Token.Type("MyAttribute"),
                Token.Punctuation.CloseBracket]);
        });

        it("typevar attribute specifier on generic type parameter", async () => {

            const input = `class Foo<[typevar: MyAttribute] T>`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Definition.Class,
                Token.Identifier.ClassName("Foo"),
                Token.Punctuation.TypeParameter.Begin,
                Token.Punctuation.OpenBracket,
                Token.Keyword.AttributeSpecifier("typevar"),
                Token.Punctuation.Colon,
                Token.Type("MyAttribute"),
                Token.Punctuation.CloseBracket,
                Token.Identifier.TypeParameterName("T"),
                Token.Punctuation.TypeParameter.End]);
        });
    });
});
