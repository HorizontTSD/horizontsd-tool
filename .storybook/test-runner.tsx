import { toMatchImageSnapshot } from "jest-image-snapshot"

import type { TestRunnerConfig } from "@storybook/test-runner"
import { getStoryContext, waitForPageReady } from "@storybook/test-runner"

const config: TestRunnerConfig = {
    setup() {
        expect.extend({ toMatchImageSnapshot })
    },

    async preVisit(page, context) {},

    async postVisit(page, context) {
        const storyContext = await getStoryContext(page, context)

        await waitForPageReady(page)
        await new Promise((ok) => setTimeout(ok, 5000))
        const image = await page.screenshot()
        expect(image).toMatchImageSnapshot()
    },
}

export default config
