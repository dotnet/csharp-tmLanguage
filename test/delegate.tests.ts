/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { should } from 'chai';
import { tokenize, Token } from './utils/tokenize';

describe("Delegates", () => {
    before(() => { should(); });

    describe("Delegates", () => {
        it("void delegate with no parameters", async () => {

            const input = `delegate void D();`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Delegate,
                Token.PrimitiveType.Void,
                Token.Identifiers.DelegateName("D"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.Semicolon]);
        });

        it("generic delegate with variance", async () => {

            const input = `delegate TResult D<in T, out TResult>(T arg1);`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Delegate,
                Token.Type("TResult"),
                Token.Identifiers.DelegateName("D"),
                Token.Punctuation.TypeParameters.Begin,
                Token.Keywords.Modifiers.In,
                Token.Identifiers.TypeParameterName("T"),
                Token.Punctuation.Comma,
                Token.Keywords.Modifiers.Out,
                Token.Identifiers.TypeParameterName("TResult"),
                Token.Punctuation.TypeParameters.End,
                Token.Punctuation.OpenParen,
                Token.Type("T"),
                Token.Identifiers.ParameterName("arg1"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.Semicolon]);
        });

        it("generic delegate with constraints", async () => {

            const input = `
delegate void D<T1, T2>()
    where T1 : T2;
`;

            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Delegate,
                Token.PrimitiveType.Void,
                Token.Identifiers.DelegateName("D"),
                Token.Punctuation.TypeParameters.Begin,
                Token.Identifiers.TypeParameterName("T1"),
                Token.Punctuation.Comma,
                Token.Identifiers.TypeParameterName("T2"),
                Token.Punctuation.TypeParameters.End,
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Keywords.Where,
                Token.Identifiers.TypeParameterName("T1"),
                Token.Punctuation.Colon,
                Token.Type("T2"),
                Token.Punctuation.Semicolon]);
        });

        it("generic delegate with attributes on type parameters", async () => {

            const input = `delegate void D<[Foo] T1, [Bar] T2>();`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Delegate,
                Token.PrimitiveType.Void,
                Token.Identifiers.DelegateName("D"),
                Token.Punctuation.TypeParameters.Begin,
                Token.Punctuation.OpenBracket,
                Token.Type("Foo"),
                Token.Punctuation.CloseBracket,
                Token.Identifiers.TypeParameterName("T1"),
                Token.Punctuation.Comma,
                Token.Punctuation.OpenBracket,
                Token.Type("Bar"),
                Token.Punctuation.CloseBracket,
                Token.Identifiers.TypeParameterName("T2"),
                Token.Punctuation.TypeParameters.End,
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.Semicolon]);
        });

        it("delegate with multiple parameters", async () => {

            const input = `delegate int D(ref string x, out int y, params object[] z);`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Delegate,
                Token.PrimitiveType.Int,
                Token.Identifiers.DelegateName("D"),
                Token.Punctuation.OpenParen,
                Token.Keywords.Modifiers.Ref,
                Token.PrimitiveType.String,
                Token.Identifiers.ParameterName("x"),
                Token.Punctuation.Comma,
                Token.Keywords.Modifiers.Out,
                Token.PrimitiveType.Int,
                Token.Identifiers.ParameterName("y"),
                Token.Punctuation.Comma,
                Token.Keywords.Modifiers.Params,
                Token.PrimitiveType.Object,
                Token.Punctuation.OpenBracket,
                Token.Punctuation.CloseBracket,
                Token.Identifiers.ParameterName("z"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.Semicolon]);
        });

        it("ref return", async () => {
            const input = `delegate ref int D();`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Delegate,
                Token.Keywords.Modifiers.Ref,
                Token.PrimitiveType.Int,
                Token.Identifiers.DelegateName("D"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.Semicolon]);
        });

        it("ref readonly return", async () => {
            const input = `delegate ref readonly int D();`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Delegate,
                Token.Keywords.Modifiers.Ref,
                Token.Keywords.Modifiers.ReadOnly,
                Token.PrimitiveType.Int,
                Token.Identifiers.DelegateName("D"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.Semicolon]);
        });
    });
});
