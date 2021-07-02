/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { should } from 'chai';
import { tokenize, Token } from './utils/tokenize';

describe("Enums", () => {
    before(() => { should(); });

    describe("Enums", () => {
        it("simple enum", async () => {

            const input = `enum E { }`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Enum,
                Token.Identifiers.EnumName("E"),
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("enum with base type", async () => {

            const input = `enum E : byte { }`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Enum,
                Token.Identifiers.EnumName("E"),
                Token.Punctuation.Colon,
                Token.PrimitiveType.Byte,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("enum with single member", async () => {

            const input = `enum E { M1 }`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Enum,
                Token.Identifiers.EnumName("E"),
                Token.Punctuation.OpenBrace,
                Token.Identifiers.EnumMemberName("M1"),
                Token.Punctuation.CloseBrace]);
        });

        it("enum with multiple members", async () => {

            const input = `enum Color { Red, Green, Blue }`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Enum,
                Token.Identifiers.EnumName("Color"),
                Token.Punctuation.OpenBrace,
                Token.Identifiers.EnumMemberName("Red"),
                Token.Punctuation.Comma,
                Token.Identifiers.EnumMemberName("Green"),
                Token.Punctuation.Comma,
                Token.Identifiers.EnumMemberName("Blue"),
                Token.Punctuation.CloseBrace]);
        });

        it("enum with initialized member", async () => {

            const input = `
enum E
{
    Value1 = 1,
    Value2,
    Value3
}
`;

            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Enum,
                Token.Identifiers.EnumName("E"),
                Token.Punctuation.OpenBrace,
                Token.Identifiers.EnumMemberName("Value1"),
                Token.Operators.Assignment,
                Token.Literals.Numeric.Decimal("1"),
                Token.Punctuation.Comma,
                Token.Identifiers.EnumMemberName("Value2"),
                Token.Punctuation.Comma,
                Token.Identifiers.EnumMemberName("Value3"),
                Token.Punctuation.CloseBrace]);
        });

        it("enum members are highligted properly (issue omnisharp-vscode#1108)", async () => {

            const input = `
public enum TestEnum
{
    enum1,
    enum2,
    enum3,
    enum4
}

public class TestClass
{

}

public enum TestEnum2
{
    enum1 = 10,
    enum2 = 15,
}

public class TestClass2
{

}
`;

            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Modifiers.Public,
                Token.Keywords.Enum,
                Token.Identifiers.EnumName("TestEnum"),
                Token.Punctuation.OpenBrace,
                Token.Identifiers.EnumMemberName("enum1"),
                Token.Punctuation.Comma,
                Token.Identifiers.EnumMemberName("enum2"),
                Token.Punctuation.Comma,
                Token.Identifiers.EnumMemberName("enum3"),
                Token.Punctuation.Comma,
                Token.Identifiers.EnumMemberName("enum4"),
                Token.Punctuation.CloseBrace,

                Token.Keywords.Modifiers.Public,
                Token.Keywords.Class,
                Token.Identifiers.ClassName("TestClass"),
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace,

                Token.Keywords.Modifiers.Public,
                Token.Keywords.Enum,
                Token.Identifiers.EnumName("TestEnum2"),
                Token.Punctuation.OpenBrace,
                Token.Identifiers.EnumMemberName("enum1"),
                Token.Operators.Assignment,
                Token.Literals.Numeric.Decimal("10"),
                Token.Punctuation.Comma,
                Token.Identifiers.EnumMemberName("enum2"),
                Token.Operators.Assignment,
                Token.Literals.Numeric.Decimal("15"),
                Token.Punctuation.Comma,
                Token.Punctuation.CloseBrace,

                Token.Keywords.Modifiers.Public,
                Token.Keywords.Class,
                Token.Identifiers.ClassName("TestClass2"),
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace
            ]);
        });
    });
});