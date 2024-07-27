import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import ProductsListComponent from './products-list.component';
import { FinancialService } from '@products/services/financial.service'; // Asegúrate de que la ruta sea correcta
import { NavigationService } from '@services/navigation.service'; // Asegúrate de que la ruta sea correcta
import { of } from 'rxjs';
import type { IFinancialData } from '@products/models';

describe('ProductsListComponent', () => {
  let component: ProductsListComponent;
  let fixture: ComponentFixture<ProductsListComponent>;
  let financialService: jest.Mocked<FinancialService>;
  let navigationService: jest.Mocked<NavigationService>;

  beforeEach(async () => {
    financialService = {
      retrieveFinancialData: jest.fn().mockReturnValue(
        of([
          {
            id: '1',
            name: 'Producto 1',
            description: 'Descripción 1',
            date_release: '2024-07-30T00:00:00.000Z',
            date_revision: '2024-07-30T00:00:00.000Z',
            logo: 'logo-url',
          },
        ] as IFinancialData[])
      ),
    } as any;

    navigationService = {
      navigateTo: jest.fn(),
    } as any;

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [ProductsListComponent],
      providers: [
        { provide: FinancialService, useValue: financialService },
        { provide: NavigationService, useValue: navigationService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsListComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should retrieve products on init', () => {
    component.ngOnInit(); // Llama al método ngOnInit
    expect(financialService.retrieveFinancialData).toHaveBeenCalled(); // Verifica que se haya llamado a la función
    fixture.detectChanges(); // Detecta cambios en el fixture
    expect(component.dataSource().length).toBe(1); // Verifica que se recuperen 1 producto
  });

  it('should navigate to new product', () => {
    component.handleNewProduct(); // Llama al método
    expect(navigationService.navigateTo).toHaveBeenCalledWith(['new-product']); // Verifica que se haya llamado a navigateTo con el argumento correcto
  });

  it('should filter products by search value', () => {
    component.dataSourceBackup = [
      {
        id: '1',
        name: 'Producto 1',
        description: 'Descripción 1',
        date_release: '2024-07-30T00:00:00.000Z',
        date_revision: '2024-07-30T00:00:00.000Z',
        logo: 'logo-url',
      },
      {
        id: '2',
        name: 'Producto 2',
        description: 'Descripción 2',
        date_release: '2024-07-30T00:00:00.000Z',
        date_revision: '2024-07-30T00:00:00.000Z',
        logo: 'logo-url',
      },
    ];
    component.searchControl.setValue('Producto 1'); // Simula el cambio de valor en el input de búsqueda
    expect(component.dataSource().length).toBe(1); // Verifica que se filtran los productos correctamente
  });
});
