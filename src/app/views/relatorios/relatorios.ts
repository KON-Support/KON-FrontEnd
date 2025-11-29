import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../../components/navbar/navbar';
import { ChamadoService } from '../../services/chamado-service';
import { Chamado } from '../../shared/models/Chamado';
import { Status } from '../../shared/models/Status';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid,
  ApexFill,
  ApexMarkers,
  ApexYAxis,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexLegend,
  ApexPlotOptions,
  ApexTooltip,
  NgApexchartsModule,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  fill: ApexFill;
  markers: ApexMarkers;
  yaxis: ApexYAxis;
  colors: string[];
  tooltip: ApexTooltip;
  plotOptions: ApexPlotOptions;
  legend: ApexLegend;
};

export type PieChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  responsive: ApexResponsive[];
  legend: ApexLegend;
  colors: string[];
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  tooltip: ApexTooltip;
};

@Component({
  selector: 'app-relatorios',
  standalone: true,
  imports: [CommonModule, FormsModule, Navbar, NgApexchartsModule],
  templateUrl: './relatorios.html',
  styleUrl: './relatorios.scss',
})

export class Relatorios implements OnInit {
  private chamadoService = inject(ChamadoService);
  private cdr = inject(ChangeDetectorRef);

  public statusChartOptions: Partial<PieChartOptions> | any;
  public categoryChartOptions: Partial<ChartOptions> | any;
  public timelineChartOptions: Partial<ChartOptions> | any;

  constructor() { }

  ngOnInit(): void {
    this.initCharts();
    setTimeout(() => {
      this.loadData();
    }, 100);
  }

  loadData() {
    this.chamadoService.buscarChamados().subscribe({
      next: (chamados) => {
        this.processStatusChart(chamados);
        this.processCategoryChart(chamados);
        this.processTimelineChart(chamados);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao carregar chamados', err);
      },
    });
  }

  processStatusChart(chamados: Chamado[]) {
    const statusCounts: { [key: string]: number } = {
      [Status.ABERTO]: 0,
      [Status.EM_ANDAMENTO]: 0,
      [Status.RESOLVIDO]: 0,
      [Status.FECHADO]: 0,
    };

    chamados.forEach((c) => {
      if (statusCounts[c.status] !== undefined) {
        statusCounts[c.status]++;
      }
    });

    this.statusChartOptions = {
      ...this.statusChartOptions,
      series: Object.values(statusCounts),
      labels: Object.keys(statusCounts).map((s) => s.replace('_', ' ')),
    };
  }

  processCategoryChart(chamados: Chamado[]) {
    const categoryCounts: { [key: string]: number } = {};

    chamados.forEach((c) => {
      const catName = c.categoria?.nmCategoria || 'Sem Categoria';
      categoryCounts[catName] = (categoryCounts[catName] || 0) + 1;
    });

    const categories = Object.keys(categoryCounts);
    const data = Object.values(categoryCounts);

    this.categoryChartOptions = {
      ...this.categoryChartOptions,
      series: [
        {
          name: 'Chamados',
          data: data,
        },
      ],
      xaxis: {
        ...this.categoryChartOptions.xaxis,
        categories: categories,
      },
    };
  }

  processTimelineChart(chamados: Chamado[]) {
    const dateMap: {
      [key: string]: { abertos: number; resolvidos: number };
    } = {};

    chamados.forEach((c) => {
      const dtCriacao = new Date(c.dtCriacao).toISOString().split('T')[0];
      if (!dateMap[dtCriacao]) {
        dateMap[dtCriacao] = { abertos: 0, resolvidos: 0 };
      }
      dateMap[dtCriacao].abertos++;

      if (c.dtFechamento) {
        const dtFechamento = new Date(c.dtFechamento).toISOString().split('T')[0];
        if (!dateMap[dtFechamento]) {
          dateMap[dtFechamento] = { abertos: 0, resolvidos: 0 };
        }
        dateMap[dtFechamento].resolvidos++;
      }
    });

    const sortedDates = Object.keys(dateMap).sort();
    const abertosData = sortedDates.map((d) => dateMap[d].abertos);
    const resolvidosData = sortedDates.map((d) => dateMap[d].resolvidos);

    this.timelineChartOptions = {
      ...this.timelineChartOptions,
      series: [
        {
          name: 'Chamados Abertos',
          data: abertosData,
        },
        {
          name: 'Chamados Resolvidos',
          data: resolvidosData,
        },
      ],
      xaxis: {
        ...this.timelineChartOptions.xaxis,
        type: 'datetime',
        categories: sortedDates,
      },
    };
  }

  initCharts() {
    this.statusChartOptions = {
      series: [],
      chart: {
        type: 'pie',
        height: 350,
      },
      labels: [],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    };

    this.categoryChartOptions = {
      series: [],
      chart: {
        type: 'bar',
        height: 350,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
      },
      xaxis: {
        categories: [],
      },
      yaxis: {
        title: {
          text: 'Quantidade',
        },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: function (val: any) {
            return val + ' chamados';
          },
        },
      },
    };

    this.timelineChartOptions = {
      series: [],
      chart: {
        height: 350,
        type: 'area',
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      xaxis: {
        type: 'datetime',
        categories: [],
      },
      tooltip: {
        x: {
          format: 'dd/MM/yy',
        },
      },
    };
  }
}
