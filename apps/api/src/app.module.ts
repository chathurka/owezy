import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
// Feature modules are added here via /spec-build after each vertical slice is approved.
// Example (auth feature):
// import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    CoreModule,
    // Feature modules registered here as each feature ships:
  ],
})
export class AppModule {}
