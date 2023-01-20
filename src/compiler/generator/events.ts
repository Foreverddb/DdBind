function genGuard(condition: string): string {
    return `if (${condition}) return; `
}

export const codeGuards = {
    'd-model': genGuard('$event.target.composing')
}