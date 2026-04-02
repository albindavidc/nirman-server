export class AddMemberCommand {
    constructor(
        public readonly groupId: string,
        public readonly workerId: string,
        public readonly memberName: string,
        public readonly memberPhotoUrl: string,
        public readonly projectId: string,
        public readonly addedById: string,
    ) {}
}