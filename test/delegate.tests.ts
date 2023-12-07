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
                Token.Keyword.Definition.Delegate,
                Token.PrimitiveType.Void,
                Token.Identifier.DelegateName("D"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.Semicolon]);
        });

        it("generic delegate with variance", async () => {

            const input = `delegate TResult D<in T, out TResult>(T arg1);`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Definition.Delegate,
                Token.Type("TResult"),
                Token.Identifier.DelegateName("D"),
                Token.Punctuation.TypeParameter.Begin,
                Token.Keyword.Modifier.In,
                Token.Identifier.TypeParameterName("T"),
                Token.Punctuation.Comma,
                Token.Keyword.Modifier.Out,
                Token.Identifier.TypeParameterName("TResult"),
                Token.Punctuation.TypeParameter.End,
                Token.Punctuation.OpenParen,
                Token.Type("T"),
                Token.Identifier.ParameterName("arg1"),
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
                Token.Keyword.Definition.Delegate,
                Token.PrimitiveType.Void,
                Token.Identifier.DelegateName("D"),
                Token.Punctuation.TypeParameter.Begin,
                Token.Identifier.TypeParameterName("T1"),
                Token.Punctuation.Comma,
                Token.Identifier.TypeParameterName("T2"),
                Token.Punctuation.TypeParameter.End,
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Keyword.Modifier.Where,
                Token.Identifier.TypeParameterName("T1"),
                Token.Punctuation.Colon,
                Token.Type("T2"),
                Token.Punctuation.Semicolon]);
        });

        it("generic delegate with attributes on type parameters", async () => {

            const input = `delegate void D<[Foo] T1, [Bar] T2>();`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Definition.Delegate,
                Token.PrimitiveType.Void,
                Token.Identifier.DelegateName("D"),
                Token.Punctuation.TypeParameter.Begin,
                Token.Punctuation.OpenBracket,
                Token.Type("Foo"),
                Token.Punctuation.CloseBracket,
                Token.Identifier.TypeParameterName("T1"),
                Token.Punctuation.Comma,
                Token.Punctuation.OpenBracket,
                Token.Type("Bar"),
                Token.Punctuation.CloseBracket,
                Token.Identifier.TypeParameterName("T2"),
                Token.Punctuation.TypeParameter.End,
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.Semicolon]);
        });

        it("delegate with multiple parameters", async () => {

            const input = `delegate int D(ref string x, out int y, params object[] z);`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Definition.Delegate,
                Token.PrimitiveType.Int,
                Token.Identifier.DelegateName("D"),
                Token.Punctuation.OpenParen,
                Token.Keyword.Modifier.Ref,
                Token.PrimitiveType.String,
                Token.Identifier.ParameterName("x"),
                Token.Punctuation.Comma,
                Token.Keyword.Modifier.Out,
                Token.PrimitiveType.Int,
                Token.Identifier.ParameterName("y"),
                Token.Punctuation.Comma,
                Token.Keyword.Modifier.Params,
                Token.PrimitiveType.Object,
                Token.Punctuation.OpenBracket,
                Token.Punctuation.CloseBracket,
                Token.Identifier.ParameterName("z"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.Semicolon]);
        });

        it("delegate that uses ImmutableArray params collection ", async () => {

            const input = `delegate int D(ref string x, out int y, params ImmutableArray<object> z);`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Definition.Delegate,
                Token.PrimitiveType.Int,
                Token.Identifier.DelegateName("D"),
                Token.Punctuation.OpenParen,
                Token.Keyword.Modifier.Ref,
                Token.PrimitiveType.String,
                Token.Identifier.ParameterName("x"),
                Token.Punctuation.Comma,
                Token.Keyword.Modifier.Out,
                Token.PrimitiveType.Int,
                Token.Identifier.ParameterName("y"),
                Token.Punctuation.Comma,
                Token.Keyword.Modifier.Params,
                Token.Type("ImmutableArray"),
                Token.Punctuation.TypeParameter.Begin,
                Token.PrimitiveType.Object,
                Token.Punctuation.TypeParameter.End,
                Token.Identifier.ParameterName("z"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.Semicolon]);
        });

        it("ref return", async () => {
            const input = `delegate ref int D();`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Definition.Delegate,
                Token.Keyword.Modifier.Ref,
                Token.PrimitiveType.Int,
                Token.Identifier.DelegateName("D"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.Semicolon]);
        });

        it("ref readonly return", async () => {
            const input = `delegate ref readonly int D();`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Definition.Delegate,
                Token.Keyword.Modifier.Ref,
                Token.Keyword.Modifier.ReadOnly,
                Token.PrimitiveType.Int,
                Token.Identifier.DelegateName("D"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.Semicolon]);
        });
    });
});
