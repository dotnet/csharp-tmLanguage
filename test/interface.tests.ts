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
                Token.Keywords.Interface,
                Token.Identifiers.InterfaceName("IFoo"),
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("interface inheritance", async () => {

            const input = `
interface IFoo { }
interface IBar : IFoo { }
`;

            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Interface,
                Token.Identifiers.InterfaceName("IFoo"),
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace,
                Token.Keywords.Interface,
                Token.Identifiers.InterfaceName("IBar"),
                Token.Punctuation.Colon,
                Token.Type("IFoo"),
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("generic interface", async () => {

            const input = `interface IFoo<T1, T2> { }`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Interface,
                Token.Identifiers.InterfaceName("IFoo"),
                Token.Punctuation.TypeParameters.Begin,
                Token.Identifiers.TypeParameterName("T1"),
                Token.Punctuation.Comma,
                Token.Identifiers.TypeParameterName("T2"),
                Token.Punctuation.TypeParameters.End,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("generic interface with variance", async () => {

            const input = `interface IFoo<in T1, out T2> { }`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Interface,
                Token.Identifiers.InterfaceName("IFoo"),
                Token.Punctuation.TypeParameters.Begin,
                Token.Keywords.Modifiers.In,
                Token.Identifiers.TypeParameterName("T1"),
                Token.Punctuation.Comma,
                Token.Keywords.Modifiers.Out,
                Token.Identifiers.TypeParameterName("T2"),
                Token.Punctuation.TypeParameters.End,
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });

        it("generic interface with constraints", async () => {

            const input = `interface IFoo<T1, T2> where T1 : T2 { }`;
            const tokens = await tokenize(input);

            tokens.should.deep.equal([
                Token.Keywords.Interface,
                Token.Identifiers.InterfaceName("IFoo"),
                Token.Punctuation.TypeParameters.Begin,
                Token.Identifiers.TypeParameterName("T1"),
                Token.Punctuation.Comma,
                Token.Identifiers.TypeParameterName("T2"),
                Token.Punctuation.TypeParameters.End,
                Token.Keywords.Where,
                Token.Identifiers.TypeParameterName("T1"),
                Token.Punctuation.Colon,
                Token.Type("T2"),
                Token.Punctuation.OpenBrace,
                Token.Punctuation.CloseBrace]);
        });
    });
});
