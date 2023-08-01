/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { should } from 'chai';
import { tokenize, Input, Token } from './utils/tokenize';

describe("Operators", () => {
    before(() => { should(); });

    describe("Operators", () => {
        it("unary +", async () => {

            const input = Input.InClass(`public static int operator +(int value) { return +value; }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Keywords.Modifiers.Static,
                Token.PrimitiveType.Int,
                Token.Keywords.Operator,
                Token.Identifiers.MethodName("+"),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifiers.ParameterName("value"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Keywords.Control.Return,
                Token.Operators.Arithmetic.Addition,
                Token.Variables.ReadWrite("value"),
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("unary -", async () => {

            const input = Input.InClass(`public static int operator -(int value) { return -value; }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Keywords.Modifiers.Static,
                Token.PrimitiveType.Int,
                Token.Keywords.Operator,
                Token.Identifiers.MethodName("-"),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifiers.ParameterName("value"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Keywords.Control.Return,
                Token.Operators.Arithmetic.Subtraction,
                Token.Variables.ReadWrite("value"),
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("unary !", async () => {

            const input = Input.InClass(`public static bool operator !(int value) { return value == 0; }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Keywords.Modifiers.Static,
                Token.PrimitiveType.Bool,
                Token.Keywords.Operator,
                Token.Identifiers.MethodName("!"),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifiers.ParameterName("value"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Keywords.Control.Return,
                Token.Variables.ReadWrite("value"),
                Token.Operators.Relational.Equals,
                Token.Literals.Numeric.Decimal("0"),
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("unary ~", async () => {

            const input = Input.InClass(`public static int operator ~(int value) { return ~value; }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Keywords.Modifiers.Static,
                Token.PrimitiveType.Int,
                Token.Keywords.Operator,
                Token.Identifiers.MethodName("~"),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifiers.ParameterName("value"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Keywords.Control.Return,
                Token.Operators.Bitwise.BitwiseComplement,
                Token.Variables.ReadWrite("value"),
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("unary ++", async () => {

            const input = Input.InClass(`public static int operator ++(int value) { return ++value; }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Keywords.Modifiers.Static,
                Token.PrimitiveType.Int,
                Token.Keywords.Operator,
                Token.Identifiers.MethodName("++"),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifiers.ParameterName("value"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Keywords.Control.Return,
                Token.Operators.Increment,
                Token.Variables.ReadWrite("value"),
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("unary --", async () => {

            const input = Input.InClass(`public static int operator --(int value) { return --value; }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Keywords.Modifiers.Static,
                Token.PrimitiveType.Int,
                Token.Keywords.Operator,
                Token.Identifiers.MethodName("--"),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifiers.ParameterName("value"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Keywords.Control.Return,
                Token.Operators.Decrement,
                Token.Variables.ReadWrite("value"),
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("unary true", async () => {
            const input = Input.InClass(`public static int operator true(int value) { return value != 0; }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Keywords.Modifiers.Static,
                Token.PrimitiveType.Int,
                Token.Keywords.Operator,
                Token.Identifiers.MethodName("true"),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifiers.ParameterName("value"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Keywords.Control.Return,
                Token.Variables.ReadWrite("value"),
                Token.Operators.Relational.NotEqual,
                Token.Literals.Numeric.Decimal("0"),
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("unary false", async () => {

            const input = Input.InClass(`public static int operator false(int value) { return value == 0; }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Keywords.Modifiers.Static,
                Token.PrimitiveType.Int,
                Token.Keywords.Operator,
                Token.Identifiers.MethodName("false"),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifiers.ParameterName("value"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Keywords.Control.Return,
                Token.Variables.ReadWrite("value"),
                Token.Operators.Relational.Equals,
                Token.Literals.Numeric.Decimal("0"),
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("static method operatortrue", async () => {
            const input = Input.InClass(`public static bool operatortrue(int value) { return value != 0; }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Keywords.Modifiers.Static,
                Token.PrimitiveType.Bool,
                Token.Identifiers.MethodName("operatortrue"),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifiers.ParameterName("value"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Keywords.Control.Return,
                Token.Variables.ReadWrite("value"),
                Token.Operators.Relational.NotEqual,
                Token.Literals.Numeric.Decimal("0"),
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("binary +", async () => {

            const input = Input.InClass(`public static int operator +(int x, int y) { return x + y; }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Keywords.Modifiers.Static,
                Token.PrimitiveType.Int,
                Token.Keywords.Operator,
                Token.Identifiers.MethodName("+"),
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
                Token.Punctuation.CloseBrace]);
        });

        it("binary -", async () => {

            const input = Input.InClass(`public static int operator -(int x, int y) { return x - y; }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Keywords.Modifiers.Static,
                Token.PrimitiveType.Int,
                Token.Keywords.Operator,
                Token.Identifiers.MethodName("-"),
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
                Token.Operators.Arithmetic.Subtraction,
                Token.Variables.ReadWrite("y"),
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("binary *", async () => {

            const input = Input.InClass(`public static int operator *(int x, int y) { return x * y; }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Keywords.Modifiers.Static,
                Token.PrimitiveType.Int,
                Token.Keywords.Operator,
                Token.Identifiers.MethodName("*"),
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
                Token.Operators.Arithmetic.Multiplication,
                Token.Variables.ReadWrite("y"),
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("binary /", async () => {

            const input = Input.InClass(`public static int operator /(int x, int y) { return x / y; }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Keywords.Modifiers.Static,
                Token.PrimitiveType.Int,
                Token.Keywords.Operator,
                Token.Identifiers.MethodName("/"),
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
                Token.Operators.Arithmetic.Division,
                Token.Variables.ReadWrite("y"),
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("binary %", async () => {

            const input = Input.InClass(`public static int operator %(int x, int y) { return x % y; }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Keywords.Modifiers.Static,
                Token.PrimitiveType.Int,
                Token.Keywords.Operator,
                Token.Identifiers.MethodName("%"),
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
                Token.Operators.Arithmetic.Remainder,
                Token.Variables.ReadWrite("y"),
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("binary &", async () => {

            const input = Input.InClass(`public static int operator &(int x, int y) { return x & y; }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Keywords.Modifiers.Static,
                Token.PrimitiveType.Int,
                Token.Keywords.Operator,
                Token.Identifiers.MethodName("&"),
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
                Token.Operators.Bitwise.And,
                Token.Variables.ReadWrite("y"),
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("binary |", async () => {

            const input = Input.InClass(`public static int operator |(int x, int y) { return x | y; }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Keywords.Modifiers.Static,
                Token.PrimitiveType.Int,
                Token.Keywords.Operator,
                Token.Identifiers.MethodName("|"),
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
                Token.Operators.Bitwise.Or,
                Token.Variables.ReadWrite("y"),
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("binary ^", async () => {

            const input = Input.InClass(`public static int operator ^(int x, int y) { return x ^ y; }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Keywords.Modifiers.Static,
                Token.PrimitiveType.Int,
                Token.Keywords.Operator,
                Token.Identifiers.MethodName("^"),
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
                Token.Operators.Bitwise.ExclusiveOr,
                Token.Variables.ReadWrite("y"),
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("binary <<", async () => {

            const input = Input.InClass(`public static int operator <<(int x, int y) { return x << y; }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Keywords.Modifiers.Static,
                Token.PrimitiveType.Int,
                Token.Keywords.Operator,
                Token.Identifiers.MethodName("<<"),
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
                Token.Operators.Bitwise.ShiftLeft,
                Token.Variables.ReadWrite("y"),
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("binary >>", async () => {

            const input = Input.InClass(`public static int operator >>(int x, int y) { return x >> y; }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Keywords.Modifiers.Static,
                Token.PrimitiveType.Int,
                Token.Keywords.Operator,
                Token.Identifiers.MethodName(">>"),
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
                Token.Operators.Bitwise.ShiftRight,
                Token.Variables.ReadWrite("y"),
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("binary >>>", async () => {
            const input = Input.InClass(`public static nuint operator >>>(nuint x, int y) { return x >>> y; }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Keywords.Modifiers.Static,
                Token.PrimitiveType.Nuint,
                Token.Keywords.Operator,
                Token.Identifiers.MethodName(">>>"),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Nuint,
                Token.Identifiers.ParameterName("x"),
                Token.Punctuation.Comma,
                Token.PrimitiveType.Int,
                Token.Identifiers.ParameterName("y"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Keywords.Control.Return,
                Token.Variables.ReadWrite("x"),
                Token.Operators.Bitwise.ShiftRightUnsigned,
                Token.Variables.ReadWrite("y"),
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("binary ==", async () => {

            const input = Input.InClass(`public static bool operator ==(int x, int y) { return x == y; }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Keywords.Modifiers.Static,
                Token.PrimitiveType.Bool,
                Token.Keywords.Operator,
                Token.Identifiers.MethodName("=="),
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
                Token.Operators.Relational.Equals,
                Token.Variables.ReadWrite("y"),
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("binary !=", async () => {

            const input = Input.InClass(`public static bool operator !=(int x, int y) { return x != y; }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Keywords.Modifiers.Static,
                Token.PrimitiveType.Bool,
                Token.Keywords.Operator,
                Token.Identifiers.MethodName("!="),
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
                Token.Operators.Relational.NotEqual,
                Token.Variables.ReadWrite("y"),
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("binary >", async () => {

            const input = Input.InClass(`public static bool operator >(int x, int y) { return x > y; }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Keywords.Modifiers.Static,
                Token.PrimitiveType.Bool,
                Token.Keywords.Operator,
                Token.Identifiers.MethodName(">"),
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
                Token.Operators.Relational.GreaterThan,
                Token.Variables.ReadWrite("y"),
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("binary <", async () => {

            const input = Input.InClass(`public static bool operator <(int x, int y) { return x < y; }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Keywords.Modifiers.Static,
                Token.PrimitiveType.Bool,
                Token.Keywords.Operator,
                Token.Identifiers.MethodName("<"),
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
                Token.Operators.Relational.LessThan,
                Token.Variables.ReadWrite("y"),
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("binary >=", async () => {

            const input = Input.InClass(`public static bool operator >=(int x, int y) { return x >= y; }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Keywords.Modifiers.Static,
                Token.PrimitiveType.Bool,
                Token.Keywords.Operator,
                Token.Identifiers.MethodName(">="),
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
                Token.Operators.Relational.GreaterThanOrEqual,
                Token.Variables.ReadWrite("y"),
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("binary <=", async () => {

            const input = Input.InClass(`public static bool operator <=(int x, int y) { return x <= y; }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Keywords.Modifiers.Static,
                Token.PrimitiveType.Bool,
                Token.Keywords.Operator,
                Token.Identifiers.MethodName("<="),
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
                Token.Operators.Relational.LessThanOrEqual,
                Token.Variables.ReadWrite("y"),
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("implicit conversion", async () => {

            const input = Input.InClass(`public static implicit operator bool(int x) { return x != 0; }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Keywords.Modifiers.Static,
                Token.Keywords.Implicit,
                Token.Keywords.Operator,
                Token.PrimitiveType.Bool,
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifiers.ParameterName("x"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Keywords.Control.Return,
                Token.Variables.ReadWrite("x"),
                Token.Operators.Relational.NotEqual,
                Token.Literals.Numeric.Decimal("0"),
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("explicit conversion", async () => {

            const input = Input.InClass(`public static explicit operator bool(int x) { return x != 0; }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Keywords.Modifiers.Static,
                Token.Keywords.Explicit,
                Token.Keywords.Operator,
                Token.PrimitiveType.Bool,
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifiers.ParameterName("x"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Keywords.Control.Return,
                Token.Variables.ReadWrite("x"),
                Token.Operators.Relational.NotEqual,
                Token.Literals.Numeric.Decimal("0"),
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("with expression body", async () => {

            const input = Input.InClass(`public static int operator +(int value) => +value;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Keywords.Modifiers.Static,
                Token.PrimitiveType.Int,
                Token.Keywords.Operator,
                Token.Identifiers.MethodName("+"),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifiers.ParameterName("value"),
                Token.Punctuation.CloseParen,
                Token.Operators.Arrow,
                Token.Operators.Arithmetic.Addition,
                Token.Variables.ReadWrite("value"),
                Token.Punctuation.Semicolon]);
        });

        it("ref return", async () => {
            const input = Input.InClass(`public static ref int operator +(int value) { return ref x; }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Keywords.Modifiers.Static,
                Token.Keywords.Modifiers.Ref,
                Token.PrimitiveType.Int,
                Token.Keywords.Operator,
                Token.Identifiers.MethodName("+"),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifiers.ParameterName("value"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Keywords.Control.Return,
                Token.Keywords.Modifiers.Ref,
                Token.Variables.ReadWrite("x"),
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("ref readonly return", async () => {
            const input = Input.InClass(`public static ref readonly int operator +(int value) { return ref x; }`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Keywords.Modifiers.Static,
                Token.Keywords.Modifiers.Ref,
                Token.Keywords.Modifiers.ReadOnly,
                Token.PrimitiveType.Int,
                Token.Keywords.Operator,
                Token.Identifiers.MethodName("+"),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifiers.ParameterName("value"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.OpenBrace,
                Token.Keywords.Control.Return,
                Token.Keywords.Modifiers.Ref,
                Token.Variables.ReadWrite("x"),
                Token.Punctuation.Semicolon,
                Token.Punctuation.CloseBrace]);
        });

        it("expression body ref return", async () => {
            const input = Input.InClass(`public static ref int operator +(int value) => ref x;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Keywords.Modifiers.Static,
                Token.Keywords.Modifiers.Ref,
                Token.PrimitiveType.Int,
                Token.Keywords.Operator,
                Token.Identifiers.MethodName("+"),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifiers.ParameterName("value"),
                Token.Punctuation.CloseParen,
                Token.Operators.Arrow,
                Token.Keywords.Modifiers.Ref,
                Token.Variables.ReadWrite("x"),
                Token.Punctuation.Semicolon]);
        });

        it("expression body ref readonly return", async () => {
            const input = Input.InClass(`public static ref readonly int operator +(int value) => ref x;`);
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Keywords.Modifiers.Static,
                Token.Keywords.Modifiers.Ref,
                Token.Keywords.Modifiers.ReadOnly,
                Token.PrimitiveType.Int,
                Token.Keywords.Operator,
                Token.Identifiers.MethodName("+"),
                Token.Punctuation.OpenParen,
                Token.PrimitiveType.Int,
                Token.Identifiers.ParameterName("value"),
                Token.Punctuation.CloseParen,
                Token.Operators.Arrow,
                Token.Keywords.Modifiers.Ref,
                Token.Variables.ReadWrite("x"),
                Token.Punctuation.Semicolon]);
        });
    });
});