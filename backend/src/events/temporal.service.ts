import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Connection, Client } from '@temporalio/client';
import { Worker } from '@temporalio/worker';
import { ExportService } from './export.service';
import { ExportRequestDto } from './dto/export-request.dto';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class TemporalService implements OnModuleInit, OnModuleDestroy {
  private connection: Connection;
  private client: Client;
  private worker: Worker;

  constructor(
    @InjectPinoLogger(TemporalService.name)
    private readonly logger: PinoLogger,
    private readonly exportService: ExportService) {
    }
    

  async onModuleInit() {
    this.logger.info("Lauching Temporal Service")
    this.worker = await Worker.create({
      activities: {
        ExportCommunity: (request: ExportRequestDto) => {
          return this.exportService.exportCommunity(request);
        }
      },
      taskQueue: 'export',
    });

    this.worker.run().catch(error => {
      this.logger.error(`Error while connecting to temporal`, error);
    }).then(() => this.logger.info(`Successfully connected to Temporal`));
  }

  async onModuleDestroy() {
    this.logger.info("Destroying temporal service.....")
    // Close connection when application shuts down
    this.worker.shutdown()
    await this.connection.close();
    this.logger.info('Disconnected from Temporal server');
  }

  // Method to get the client to use in your services
  getClient(): Client {
    return this.client;
  }

  // Helper to start a workflow
  async startWorkflow(workflowType: string, args: any[], options: any = {}) {
    const handle = await this.client.workflow.start(workflowType, {
      taskQueue: options.taskQueue || 'default',
      workflowId: options.workflowId || `workflow-${Date.now()}`,
      args,
    });
    
    this.logger.info(`Started workflow ${workflowType} with ID ${handle.workflowId}`);
    return handle;
  }
}