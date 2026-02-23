export class BlockWorkerCommand {
  constructor(public readonly id: string) {}
}

export class UnblockWorkerCommand {
  constructor(public readonly id: string) {}
}
