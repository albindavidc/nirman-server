import { CreateVendorUserDto } from "../dto/create-vendor-user.dto";

export class CreateVendorUserCommand {
  constructor(public readonly dto: CreateVendorUserDto) {}
}
