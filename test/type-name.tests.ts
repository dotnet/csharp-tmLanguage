/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { should } from 'chai';
import { tokenize, Input, Token } from './utils/tokenize';

describe("Grammar", () => {
    before(() => { should(); });

    describe("Type names", () => {
        it("built-in type - object", async () => {
            const input = Input.InClass(`object x;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.PrimitiveType.Object,
                Token.Identifiers.FieldName("x"),
                Token.Punctuation.Semicolon]);
        });

        it("qualified name - System.Object", async () => {
            const input = Input.InClass(`System.Object x;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Type("System"),
                Token.Punctuation.Accessor,
                Token.Type("Object"),
                Token.Identifiers.FieldName("x"),
                Token.Punctuation.Semicolon]);
        });

        it("globally-qualified name - global::System.Object", async () => {
            const input = Input.InClass(`global::System.Object x;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Identifiers.AliasName("global"),
                Token.Punctuation.ColonColon,
                Token.Type("System"),
                Token.Punctuation.Accessor,
                Token.Type("Object"),
                Token.Identifiers.FieldName("x"),
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
                Token.Identifiers.FieldName("x"),
                Token.Punctuation.Semicolon]);
        });

        it("tuple type with element names - (int i, int j)", async () => {
            const input = Input.InClass(`(int i, int j) x;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifiers.TupleElementName("i"),
                Token.Punctuation.Comma,
                Token.PrimitiveType.Int,
                Token.Identifiers.TupleElementName("j"),
                Token.Punctuation.CloseParen,
                Token.Identifiers.FieldName("x"),
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
                Token.Identifiers.FieldName("x"),
                Token.Punctuation.Semicolon]);
        });

        it("nested tuple type with element names - (int i, (int j, int k))", async () => {
            const input = Input.InClass(`(int i, (int j, int k)) x;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifiers.TupleElementName("i"),
                Token.Punctuation.Comma,
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifiers.TupleElementName("j"),
                Token.Punctuation.Comma,
                Token.PrimitiveType.Int,
                Token.Identifiers.TupleElementName("k"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.CloseParen,
                Token.Identifiers.FieldName("x"),
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
                Token.Identifiers.FieldName("x"),
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
                Token.Identifiers.FieldName("x"),
                Token.Punctuation.Semicolon]);
        });

        it("generic type - List<int>", async () => {
            const input = Input.InClass(`List<int> x;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Type("List"),
                Token.Punctuation.TypeParameters.Begin,
                Token.PrimitiveType.Int,
                Token.Punctuation.TypeParameters.End,
                Token.Identifiers.FieldName("x"),
                Token.Punctuation.Semicolon]);
        });

        it("generic type with tuple - List<(int, int)>", async () => {
            const input = Input.InClass(`List<(int, int)> x;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Type("List"),
                Token.Punctuation.TypeParameters.Begin,
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Punctuation.Comma,
                Token.PrimitiveType.Int,
                Token.Punctuation.CloseParen,
                Token.Punctuation.TypeParameters.End,
                Token.Identifiers.FieldName("x"),
                Token.Punctuation.Semicolon]);
        });

        it("generic type with tuple with element names - List<(int i, int j)>", async () => {
            const input = Input.InClass(`List<(int i, int j)> x;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Type("List"),
                Token.Punctuation.TypeParameters.Begin,
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifiers.TupleElementName("i"),
                Token.Punctuation.Comma,
                Token.PrimitiveType.Int,
                Token.Identifiers.TupleElementName("j"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.TypeParameters.End,
                Token.Identifiers.FieldName("x"),
                Token.Punctuation.Semicolon]);
        });

        it("generic type with multiple parameters - Dictionary<int, int>", async () => {
            const input = Input.InClass(`Dictionary<int, int> x;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Type("Dictionary"),
                Token.Punctuation.TypeParameters.Begin,
                Token.PrimitiveType.Int,
                Token.Punctuation.Comma,
                Token.PrimitiveType.Int,
                Token.Punctuation.TypeParameters.End,
                Token.Identifiers.FieldName("x"),
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
                Token.Punctuation.TypeParameters.Begin,
                Token.PrimitiveType.Int,
                Token.Punctuation.TypeParameters.End,
                Token.Identifiers.FieldName("x"),
                Token.Punctuation.Semicolon]);
        });

        it("generic type with nested type - List<int>.Enumerator", async () => {
            const input = Input.InClass(`List<int>.Enumerator x;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Type("List"),
                Token.Punctuation.TypeParameters.Begin,
                Token.PrimitiveType.Int,
                Token.Punctuation.TypeParameters.End,
                Token.Punctuation.Accessor,
                Token.Type("Enumerator"),
                Token.Identifiers.FieldName("x"),
                Token.Punctuation.Semicolon]);
        });

        it("nullable type - int?", async () => {
            const input = Input.InClass(`int? x;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.PrimitiveType.Int,
                Token.Punctuation.QuestionMark,
                Token.Identifiers.FieldName("x"),
                Token.Punctuation.Semicolon]);
        });

        it("ref local type - ref int", async () => {
            const input = Input.InMethod(`ref int x;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Ref,
                Token.PrimitiveType.Int,
                Token.Identifiers.LocalName("x"),
                Token.Punctuation.Semicolon]);
        });

        it("ref implicit local type - ref int", async () => {
            const input = Input.InMethod(`ref var x;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Ref,
                Token.Keywords.Var,
                Token.Identifiers.LocalName("x"),
                Token.Punctuation.Semicolon]);
        });
    });
});