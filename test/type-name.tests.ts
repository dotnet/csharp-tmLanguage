/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { should } from 'chai';
import { tokenize, Input, Token } from './utils/tokenize';

describe("Type names", () => {
    before(() => { should(); });

    describe("Type names", () => {
        it("built-in type - object", async () => {
            const input = Input.InClass(`object x;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.PrimitiveType.Object,
                Token.Identifier.FieldName("x"),
                Token.Punctuation.Semicolon]);
        });

        it("qualified name - System.Object", async () => {
            const input = Input.InClass(`System.Object x;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Type("System"),
                Token.Punctuation.Accessor,
                Token.Type("Object"),
                Token.Identifier.FieldName("x"),
                Token.Punctuation.Semicolon]);
        });

        it("globally-qualified name - global::System.Object", async () => {
            const input = Input.InClass(`global::System.Object x;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Identifier.AliasName("global"),
                Token.Punctuation.ColonColon,
                Token.Type("System"),
                Token.Punctuation.Accessor,
                Token.Type("Object"),
                Token.Identifier.FieldName("x"),
                Token.Punctuation.Semicolon]);
        });

        it("tuple type - (int, int)", async () => {
            const input = Input.InClass(`(int, int) x;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Punctuation.Comma,
                Token.PrimitiveType.Int,
                Token.Punctuation.CloseParen,
                Token.Identifier.FieldName("x"),
                Token.Punctuation.Semicolon]);
        });

        it("tuple type with element names - (int i, int j)", async () => {
            const input = Input.InClass(`(int i, int j) x;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifier.TupleElementName("i"),
                Token.Punctuation.Comma,
                Token.PrimitiveType.Int,
                Token.Identifier.TupleElementName("j"),
                Token.Punctuation.CloseParen,
                Token.Identifier.FieldName("x"),
                Token.Punctuation.Semicolon]);
        });

        it("nested tuple type - (int, (int, int))", async () => {
            const input = Input.InClass(`(int, (int, int)) x;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Punctuation.Comma,
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Punctuation.Comma,
                Token.PrimitiveType.Int,
                Token.Punctuation.CloseParen,
                Token.Punctuation.CloseParen,
                Token.Identifier.FieldName("x"),
                Token.Punctuation.Semicolon]);
        });

        it("nested tuple type with element names - (int i, (int j, int k))", async () => {
            const input = Input.InClass(`(int i, (int j, int k)) x;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifier.TupleElementName("i"),
                Token.Punctuation.Comma,
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifier.TupleElementName("j"),
                Token.Punctuation.Comma,
                Token.PrimitiveType.Int,
                Token.Identifier.TupleElementName("k"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.CloseParen,
                Token.Identifier.FieldName("x"),
                Token.Punctuation.Semicolon]);
        });

        it("nullable tuple type - (int, int)?", async () => {
            const input = Input.InClass(`(int, int)? x;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Punctuation.Comma,
                Token.PrimitiveType.Int,
                Token.Punctuation.CloseParen,
                Token.Punctuation.QuestionMark,
                Token.Identifier.FieldName("x"),
                Token.Punctuation.Semicolon]);
        });

        it("array tuple type - (int, int)[]", async () => {
            const input = Input.InClass(`(int, int)[] x;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Punctuation.Comma,
                Token.PrimitiveType.Int,
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBracket,
                Token.Punctuation.CloseBracket,
                Token.Identifier.FieldName("x"),
                Token.Punctuation.Semicolon]);
        });

        it("generic type - List<int>", async () => {
            const input = Input.InClass(`List<int> x;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Type("List"),
                Token.Punctuation.TypeParameter.Begin,
                Token.PrimitiveType.Int,
                Token.Punctuation.TypeParameter.End,
                Token.Identifier.FieldName("x"),
                Token.Punctuation.Semicolon]);
        });

        it("generic type with tuple - List<(int, int)>", async () => {
            const input = Input.InClass(`List<(int, int)> x;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Type("List"),
                Token.Punctuation.TypeParameter.Begin,
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Punctuation.Comma,
                Token.PrimitiveType.Int,
                Token.Punctuation.CloseParen,
                Token.Punctuation.TypeParameter.End,
                Token.Identifier.FieldName("x"),
                Token.Punctuation.Semicolon]);
        });

        it("generic type with tuple with element names - List<(int i, int j)>", async () => {
            const input = Input.InClass(`List<(int i, int j)> x;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Type("List"),
                Token.Punctuation.TypeParameter.Begin,
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifier.TupleElementName("i"),
                Token.Punctuation.Comma,
                Token.PrimitiveType.Int,
                Token.Identifier.TupleElementName("j"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.TypeParameter.End,
                Token.Identifier.FieldName("x"),
                Token.Punctuation.Semicolon]);
        });

        it("generic type with multiple parameters - Dictionary<int, int>", async () => {
            const input = Input.InClass(`Dictionary<int, int> x;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Type("Dictionary"),
                Token.Punctuation.TypeParameter.Begin,
                Token.PrimitiveType.Int,
                Token.Punctuation.Comma,
                Token.PrimitiveType.Int,
                Token.Punctuation.TypeParameter.End,
                Token.Identifier.FieldName("x"),
                Token.Punctuation.Semicolon]);
        });

        it("qualified generic type - System.Collections.Generic.List<int>", async () => {
            const input = Input.InClass(`System.Collections.Generic.List<int> x;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Type("System"),
                Token.Punctuation.Accessor,
                Token.Type("Collections"),
                Token.Punctuation.Accessor,
                Token.Type("Generic"),
                Token.Punctuation.Accessor,
                Token.Type("List"),
                Token.Punctuation.TypeParameter.Begin,
                Token.PrimitiveType.Int,
                Token.Punctuation.TypeParameter.End,
                Token.Identifier.FieldName("x"),
                Token.Punctuation.Semicolon]);
        });

        it("generic type with nested type - List<int>.Enumerator", async () => {
            const input = Input.InClass(`List<int>.Enumerator x;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Type("List"),
                Token.Punctuation.TypeParameter.Begin,
                Token.PrimitiveType.Int,
                Token.Punctuation.TypeParameter.End,
                Token.Punctuation.Accessor,
                Token.Type("Enumerator"),
                Token.Identifier.FieldName("x"),
                Token.Punctuation.Semicolon]);
        });

        it("nullable type - int?", async () => {
            const input = Input.InClass(`int? x;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.PrimitiveType.Int,
                Token.Punctuation.QuestionMark,
                Token.Identifier.FieldName("x"),
                Token.Punctuation.Semicolon]);
        });

        it("nullable array type - int[]?", async () => {
            const input = Input.InClass(`int[]? x;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.PrimitiveType.Int,
                Token.Punctuation.OpenBracket,
                Token.Punctuation.CloseBracket,
                Token.Punctuation.QuestionMark,
                Token.Identifier.FieldName("x"),
                Token.Punctuation.Semicolon]);
        });

        it("ref local type - ref int", async () => {
            const input = Input.InMethod(`ref int x;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Ref,
                Token.PrimitiveType.Int,
                Token.Identifier.LocalName("x"),
                Token.Punctuation.Semicolon]);
        });

        it("ref implicit local type - ref int", async () => {
            const input = Input.InMethod(`ref var x;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Ref,
                Token.Keyword.Definition.Var,
                Token.Identifier.LocalName("x"),
                Token.Punctuation.Semicolon]);
        });

        it("assignments new object creation expression", async () => {
            const input = Input.InMethod(`x = new List<int>();`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Variable.ReadWrite("x"),
                Token.Operator.Assignment,
                Token.Operator.Expression.New,
                Token.Type("List"),
                Token.Punctuation.TypeParameter.Begin,
                Token.PrimitiveType.Int,
                Token.Punctuation.TypeParameter.End,
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.Semicolon]);
        });

        it("assignments target-typed new object creation expression", async () => {
            const input = Input.InMethod(`List<int> x = new();`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Type("List"),
                Token.Punctuation.TypeParameter.Begin,
                Token.PrimitiveType.Int,
                Token.Punctuation.TypeParameter.End,
                Token.Identifier.LocalName("x"),
                Token.Operator.Assignment,
                Token.Operator.Expression.New,
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.Semicolon]);
        });

        it("assignments new array creation expression", async () => {
            const input = Input.InMethod(`x = new string[4];`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Variable.ReadWrite("x"),
                Token.Operator.Assignment,
                Token.Operator.Expression.New,
                Token.PrimitiveType.String,
                Token.Punctuation.OpenBracket,
                Token.Literal.Numeric.Decimal("4"),
                Token.Punctuation.CloseBracket,
                Token.Punctuation.Semicolon]);
        });

        it("assignments new anonymous object creation expression", async () => {
            const input = Input.InMethod(`x = new { Length = 5 };`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Variable.ReadWrite("x"),
                Token.Operator.Assignment,
                Token.Operator.Expression.New,
                Token.Punctuation.OpenBrace,
                Token.Variable.ReadWrite("Length"),
                Token.Operator.Assignment,
                Token.Literal.Numeric.Decimal("5"),
                Token.Punctuation.CloseBrace,
                Token.Punctuation.Semicolon]);
        });
    });
});