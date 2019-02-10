import { Container } from '@/models/Container';

export interface CMSPage {
    left?: string;
    right?: string;
    toc: boolean;
    containers: Container[];
}
