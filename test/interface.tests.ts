/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { should } from 'chai';
import { tokenize, Token } from './utils/tokenize';

describe("Interfaces", () => {
    before(() => { should(); });

    describe("Interfaces", () => {
        it("simple interface", async () => {

            const input = `interface IFoo { }`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Definition.Interface,
                Token.Identifier.InterfaceName("IFoo"),
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("interface with no body", async () => {

            const input = `interface IFoo;`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Definition.Interface,
                Token.Identifier.InterfaceName("IFoo"),
                Token.Punctuation.Semicolon]);
        });

        it("interface inheritance", async () => {

            const input = `
interface IFoo { }
interface IBar : IFoo { }
`;

            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Definition.Interface,
                Token.Identifier.InterfaceName("IFoo"),
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace,
                Token.Keyword.Definition.Interface,
                Token.Identifier.InterfaceName("IBar"),
                Token.Punctuation.Colon,
                Token.Type("IFoo"),
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("generic interface", async () => {

            const input = `interface IFoo<T1, T2> { }`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Definition.Interface,
                Token.Identifier.InterfaceName("IFoo"),
                Token.Punctuation.TypeParameter.Begin,
                Token.Identifier.TypeParameterName("T1"),
                Token.Punctuation.Comma,
                Token.Identifier.TypeParameterName("T2"),
                Token.Punctuation.TypeParameter.End,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("generic interface with variance", async () => {

            const input = `interface IFoo<in T1, out T2> { }`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Definition.Interface,
                Token.Identifier.InterfaceName("IFoo"),
                Token.Punctuation.TypeParameter.Begin,
                Token.Keyword.Modifier.In,
                Token.Identifier.TypeParameterName("T1"),
                Token.Punctuation.Comma,
                Token.Keyword.Modifier.Out,
                Token.Identifier.TypeParameterName("T2"),
                Token.Punctuation.TypeParameter.End,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("generic interface with constraints", async () => {

            const input = `interface IFoo<T1, T2> where T1 : T2 { }`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Definition.Interface,
                Token.Identifier.InterfaceName("IFoo"),
                Token.Punctuation.TypeParameter.Begin,
                Token.Identifier.TypeParameterName("T1"),
                Token.Punctuation.Comma,
                Token.Identifier.TypeParameterName("T2"),
                Token.Punctuation.TypeParameter.End,
                Token.Keyword.Modifier.Where,
                Token.Identifier.TypeParameterName("T1"),
                Token.Punctuation.Colon,
                Token.Type("T2"),
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("generic interface with abstract methods (issue #307)", async () => {

            const input = `
public interface IAdditionSubtraction<T> where T : IAdditionSubtraction<T>
{
    public abstract static T operator -(T left, T right);
    abstract static T operator +(T left, T right);
    public abstract void M();
    void N();
}`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keyword.Modifier.Public,
                Token.Keyword.Definition.Interface,
                Token.Identifier.InterfaceName("IAdditionSubtraction"),
                Token.Punctuation.TypeParameter.Begin,
                Token.Identifier.TypeParameterName("T"),
                Token.Punctuation.TypeParameter.End,
                Token.Keyword.Modifier.Where,
                Token.Identifier.TypeParameterName("T"),
                Token.Punctuation.Colon,
                Token.Type("IAdditionSubtraction"),
                Token.Punctuation.TypeParameter.Begin,
                Token.Type("T"),
                Token.Punctuation.TypeParameter.End,
                Token.Punctuation.OpenBrace,

                Token.Keyword.Modifier.Public,
                Token.Keyword.Modifier.Abstract,
                Token.Keyword.Modifier.Static,
                Token.Type("T"),
                Token.Keyword.Definition.Operator,
                Token.Identifier.MethodName("-"),
                Token.Punctuation.OpenParen,
                Token.Type("T"),
                Token.Identifier.ParameterName("left"),
                Token.Punctuation.Comma,
                Token.Type("T"),
                Token.Identifier.ParameterName("right"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.Semicolon,

                Token.Keyword.Modifier.Abstract,
                Token.Keyword.Modifier.Static,
                Token.Type("T"),
                Token.Keyword.Definition.Operator,
                Token.Identifier.MethodName("+"),
                Token.Punctuation.OpenParen,
                Token.Type("T"),
                Token.Identifier.ParameterName("left"),
                Token.Punctuation.Comma,
                Token.Type("T"),
                Token.Identifier.ParameterName("right"),
                Token.Punctuation.CloseParen,
                Token.Punctuation.Semicolon,

                Token.Keyword.Modifier.Public,
                Token.Keyword.Modifier.Abstract,
                Token.PrimitiveType.Void,
                Token.Identifier.MethodName("M"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.Semicolon,

                Token.PrimitiveType.Void,
                Token.Identifier.MethodName("N"),
                Token.Punctuation.OpenParen,
                Token.Punctuation.CloseParen,
                Token.Punctuation.Semicolon,

                Token.Punctuation.CloseBrace]);
        });
    });
});
