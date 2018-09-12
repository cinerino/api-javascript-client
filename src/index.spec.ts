/**
 * index spec
 */
import * as sinon from 'sinon';

let sandbox: sinon.SinonSandbox;

describe('サンプルテスト', () => {
    beforeEach(() => {
        sandbox = sinon.sandbox.create();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('サンプルテスト', async () => {
        sandbox.verify();
    });
});
