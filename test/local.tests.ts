/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { should } from 'chai';
import { tokenize, Input, Token } from './utils/tokenize';

describe("Grammar", () => {
    before(() => { should(); });

    describe("Locals", () => {
        it("declaration", async () => {
            const input = Input.InMethod(`int x;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.PrimitiveType.Int,
                Token.Identifiers.LocalName("x"),
                Token.Punctuation.Semicolon
            ]);
        });

        it("declaration with initializer", async () => {
            const input = Input.InMethod(`int x = 42;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.PrimitiveType.Int,
                Token.Identifiers.LocalName("x"),
                Token.Operators.Assignment,
                Token.Literals.Numeric.Decimal("42"),
                Token.Punctuation.Semicolon
            ]);
        });

        it("multiple declarators", async () => {
            const input = Input.InMethod(`int x, y;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.PrimitiveType.Int,
                Token.Identifiers.LocalName("x"),
                Token.Punctuation.Comma,
                Token.Identifiers.LocalName("y"),
                Token.Punctuation.Semicolon
            ]);
        });

        it("multiple declarators with initializers", async () => {
            const input = Input.InMethod(`int x = 19, y = 23;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.PrimitiveType.Int,
                Token.Identifiers.LocalName("x"),
                Token.Operators.Assignment,
                Token.Literals.Numeric.Decimal("19"),
                Token.Punctuation.Comma,
                Token.Identifiers.LocalName("y"),
                Token.Operators.Assignment,
                Token.Literals.Numeric.Decimal("23"),
                Token.Punctuation.Semicolon
            ]);
        });

        it("const declaration", async () => {
            const input = Input.InMethod(`const int x = 42;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Const,
                Token.PrimitiveType.Int,
                Token.Identifiers.LocalName("x"),
                Token.Operators.Assignment,
                Token.Literals.Numeric.Decimal("42"),
                Token.Punctuation.Semicolon
            ]);
        });

        it("const with multiple declarators", async () => {
            const input = Input.InMethod(`const int x = 19, y = 23;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Const,
                Token.PrimitiveType.Int,
                Token.Identifiers.LocalName("x"),
                Token.Operators.Assignment,
                Token.Literals.Numeric.Decimal("19"),
                Token.Punctuation.Comma,
                Token.Identifiers.LocalName("y"),
                Token.Operators.Assignment,
                Token.Literals.Numeric.Decimal("23"),
                Token.Punctuation.Semicolon
            ]);
        });

        it("ref local", async () => {
            const input = Input.InMethod(`ref int x;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Ref,
                Token.PrimitiveType.Int,
                Token.Identifiers.LocalName("x"),
                Token.Punctuation.Semicolon
            ]);
        });

        it("ref readonly local", async () => {
            const input = Input.InMethod(`ref readonly int x;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Ref,
                Token.Keywords.Modifiers.ReadOnly,
                Token.PrimitiveType.Int,
                Token.Identifiers.LocalName("x"),
                Token.Punctuation.Semicolon
            ]);
        });

        it("ref local with initializer", async () => {
            const input = Input.InMethod(`ref int x = ref y;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Ref,
                Token.PrimitiveType.Int,
                Token.Identifiers.LocalName("x"),
                Token.Operators.Assignment,
                Token.Keywords.Modifiers.Ref,
                Token.Variables.ReadWrite("y"),
                Token.Punctuation.Semicolon
            ]);
        });

        it("ref readonly local with initializer", async () => {
            const input = Input.InMethod(`ref readonly int x = ref y;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Ref,
                Token.Keywords.Modifiers.ReadOnly,
                Token.PrimitiveType.Int,
                Token.Identifiers.LocalName("x"),
                Token.Operators.Assignment,
                Token.Keywords.Modifiers.Ref,
                Token.Variables.ReadWrite("y"),
                Token.Punctuation.Semicolon
            ]);
        });

        it("ref readonly local var with initializer", async () => {
            const input = Input.InMethod(`ref readonly var x = ref y;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Ref,
                Token.Keywords.Modifiers.ReadOnly,
                Token.Keywords.Var,
                Token.Identifiers.LocalName("x"),
                Token.Operators.Assignment,
                Token.Keywords.Modifiers.Ref,
                Token.Variables.ReadWrite("y"),
                Token.Punctuation.Semicolon
            ]);
        });

        it("local function declaration with arrow body", async () => {
            const input = Input.InClass(`int Add(int x, int y) => x + y;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.PrimitiveType.Int,
                Token.Identifiers.MethodName("Add"),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifiers.ParameterName("x"),
                Token.Punctuation.Comma,
                Token.PrimitiveType.Int,
                Token.Identifiers.ParameterName("y"),
                Token.Punctuation.CloseParen,
                Token.Operators.Arrow,
                Token.Variables.ReadWrite("x"),
                Token.Operators.Arithmetic.Addition,
                Token.Variables.ReadWrite("y"),
                Token.Punctuation.Semicolon
            ]);
        });

        it("local function declaration with block definition", async () => {
            const input = Input.InMethod(`
int Add(int x, int y)
{
    return x + y;
}`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.PrimitiveType.Int,
                Token.Identifiers.MethodName("Add"),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifiers.ParameterName("x"),
                Token.Punctuation.Comma,
                Token.PrimitiveType.Int,
                Token.Identifiers.ParameterName("y"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Keywords.Control.Return,
                Token.Variables.ReadWrite("x"),
                Token.Operators.Arithmetic.Addition,
                Token.Variables.ReadWrite("y"),
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace
            ]);
        });

        it("local function declaration with async modifier", async () => {
            const input = Input.InClass(`async void Foo() { }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Async,
                Token.PrimitiveType.Void,
                Token.Identifiers.MethodName("Foo"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace
            ]);
        });
        
        it("local function declaration with unsafe modifier", async () => {
            const input = Input.InClass(`unsafe void Foo() { }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Unsafe,
                Token.PrimitiveType.Void,
                Token.Identifiers.MethodName("Foo"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace
            ]);
        });

        it("local function declaration with static modifier", async () => {
            const input = Input.InClass(`static void Foo() { }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Static,
                Token.PrimitiveType.Void,
                Token.Identifiers.MethodName("Foo"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace
            ]);
        });

        it("local function declaration with extern modifier", async () => {
            const input = Input.InClass(`extern static void Foo() { }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Extern,
                Token.Keywords.Modifiers.Static,
                Token.PrimitiveType.Void,
                Token.Identifiers.MethodName("Foo"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace
            ]);
        });
    });
});