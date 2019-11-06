/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { should } from 'chai';
import { tokenize, Token } from './utils/tokenize';

describe("Grammar", () => {
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
                Token.Keywords.AttributeSpecifier("assembly"),
                Token.Punctuation.Colon,
                Token.Type("Foo"),
                Token.Punctuation.CloseBracket]);
        });

        it("Two global attributes in same section with specifier", async () => {

            const input = `[module: Foo, Bar]`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.OpenBracket,
                Token.Keywords.AttributeSpecifier("module"),
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
                Token.Keywords.AttributeSpecifier("module"),
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
                Token.Literals.Boolean.True,
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
                Token.Literals.Boolean.True,
                Token.Punctuation.Comma,
                Token.Literals.Numeric.Decimal("42"),
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
                Token.Literals.Boolean.True,
                Token.Punctuation.Comma,
                Token.Literals.Numeric.Decimal("42"),
                Token.Punctuation.Comma,
                Token.Punctuation.String.Begin,
                Token.Literals.String("text"),
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
                Token.Identifiers.PropertyName("Bar"),
                Token.Operators.Assignment,
                Token.Literals.Numeric.Decimal("42"),
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
                Token.Literals.Boolean.True,
                Token.Punctuation.Comma,
                Token.Identifiers.PropertyName("Bar"),
                Token.Operators.Assignment,
                Token.Literals.Numeric.Decimal("42"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.CloseBracket]);
        });

        it("Global attribute with specifier, one positional argument, and two named arguments", async () => {

            const input = `[module: Foo(true, Bar = 42, Baz = "hello")]`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.OpenBracket,
                Token.Keywords.AttributeSpecifier("module"),
                Token.Punctuation.Colon,
                Token.Type("Foo"),
                Token.Punctuation.OpenParen,
                Token.Literals.Boolean.True,
                Token.Punctuation.Comma,
                Token.Identifiers.PropertyName("Bar"),
                Token.Operators.Assignment,
                Token.Literals.Numeric.Decimal("42"),
                Token.Punctuation.Comma,
                Token.Identifiers.PropertyName("Baz"),
                Token.Operators.Assignment,
                Token.Punctuation.String.Begin,
                Token.Literals.String("hello"),
                Token.Punctuation.String.End,
                Token.Punctuation.CloseParen,
                Token.Punctuation.CloseBracket]);
        });
    });
});