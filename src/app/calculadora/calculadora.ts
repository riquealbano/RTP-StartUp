import { Component, OnInit } from '@angular/core';

// Interfaces para tipagem dos elementos DOM
type HTMLElements = HTMLButtonElement | HTMLSelectElement | HTMLInputElement | HTMLElement | HTMLUListElement | HTMLAnchorElement | null;

@Component({
  selector: 'app-calculadora',
  standalone: false,
  templateUrl: './calculadora.html',
  styleUrl: './calculadora.css',
})



export class Calculadora implements OnInit {

  // O Angular executa este código quando o componente está pronto.
  ngOnInit(): void {
    this.initializeCalculatorLogic();
  }

  // A lógica do JS/TS foi encapsulada neste método
  private initializeCalculatorLogic(): void {
    
    // ----------------------------------------------------------------------
    // 1. Elementos do DOM (Usando 'as' para tipagem e '!' para forçar a existência)
    // ----------------------------------------------------------------------

    // Função auxiliar para obter elementos de forma tipada
    const getElement = (id: string) => document.getElementById(id);
    
    // Controles
    const calculateBtn = getElement('calculateBtn') as HTMLButtonElement;
    const resetBtn = getElement('resetBtn') as HTMLButtonElement;
    
    // Inputs
    const propertyType = getElement('propertyType') as HTMLSelectElement;
    const propertyValue = getElement('propertyValue') as HTMLInputElement;
    const city = getElement('city') as HTMLSelectElement;
    const area = getElement('area') as HTMLInputElement;
    const usage = getElement('usage') as HTMLSelectElement;
    const ownerAge = getElement('ownerAge') as HTMLInputElement;

    // Elementos de Resultados
    const iptuResult = getElement('iptuResult') as HTMLElement;
    const itbiResult = getElement('itbiResult') as HTMLElement;
    const cleaningResult = getElement('cleaningResult') as HTMLElement;
    const fireResult = getElement('fireResult') as HTMLElement;

    // Elementos de Detalhamento
    const iptuDetail = getElement('iptuDetail') as HTMLElement;
    const cleaningDetail = getElement('cleaningDetail') as HTMLElement;
    const fireDetail = getElement('fireDetail') as HTMLElement;
    const condoDetail = getElement('condoDetail') as HTMLElement;
    const totalDetail = getElement('totalDetail') as HTMLElement;
    const savingsResult = getElement('savingsResult') as HTMLElement;

    // Elementos de Comparação
    const manualTotal = getElement('manualTotal') as HTMLElement;
    const systemTotal = getElement('systemTotal') as HTMLElement;
    const comparisonSavings = getElement('comparisonSavings') as HTMLElement;

    // Menu mobile (A lógica foi mantida, mas é redundante se você usa o menu Bootstrap)
    const mobileMenu = document.querySelector('.mobile-menu') as HTMLButtonElement;
    const nav = document.querySelector('nav ul') as HTMLUListElement;

    // ----------------------------------------------------------------------
    // 2. Funções Auxiliares de Cálculo
    // ----------------------------------------------------------------------
    
    function formatCurrency(value: number): string {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }

    function calculateIPTU(value: number, city: string, area: number, usage: string, age: number): number {
        let rate: number = 0;
        
        switch (city) {
            case 'sao-paulo': rate = 0.01; break;
            case 'rio-de-janeiro': rate = 0.008; break;
            case 'belo-horizonte': rate = 0.009; break;
            case 'brasilia': rate = 0.007; break;
            case 'salvador': rate = 0.011; break;
            default: rate = 0.01;
        }

        if (usage === 'propria') {
            rate *= 0.9;
        }

        if (age >= 65) {
            rate *= 0.8;
        }

        return value * rate;
    }

    function calculateITBI(value: number, city: string): number {
        let rate: number = 0;
        
        switch (city) {
            case 'sao-paulo': rate = 0.03; break;
            case 'rio-de-janeiro': rate = 0.02; break;
            case 'belo-horizonte': rate = 0.025; break;
            case 'brasilia': rate = 0.02; break;
            case 'salvador': rate = 0.035; break;
            default: rate = 0.03;
        }
        
        return value * rate;
    }

    function calculateCleaningTax(city: string, area: number): number {
        let baseRate: number = 0;
        
        switch (city) {
            case 'sao-paulo': baseRate = 10; break;
            case 'rio-de-janeiro': baseRate = 8; break;
            case 'belo-horizonte': baseRate = 9; break;
            case 'brasilia': baseRate = 7; break;
            case 'salvador': baseRate = 11; break;
            default: baseRate = 10;
        }
        
        return baseRate * area;
    }

    function calculateFireTax(city: string, area: number): number {
        let baseRate: number = 0;
        
        switch (city) {
            case 'sao-paulo': baseRate = 5; break;
            case 'rio-de-janeiro': baseRate = 4; break;
            case 'belo-horizonte': baseRate = 4.5; break;
            case 'brasilia': baseRate = 3.5; break;
            case 'salvador': baseRate = 5.5; break;
            default: baseRate = 5;
        }
        
        return baseRate * area;
    }

    function calculateCondoFee(value: number, area: number): number {
        return (value * 0.001) + (area * 2);
    }

    function calculateSavings(totalAnnual: number, usage: string, age: number): number {
        let savings: number = totalAnnual * 0.1;
        
        if (usage === 'propria' && age >= 65) {
            savings += totalAnnual * 0.05;
        }
        
        if (usage === 'aluguel') {
            savings += totalAnnual * 0.03;
        }
        
        return savings;
    }
    
    // ----------------------------------------------------------------------
    // 3. Funções Principais e Event Handlers
    // ----------------------------------------------------------------------

    const handleCalculate = (): void => {
        // Validação
        const valueStr = propertyValue.value.trim();
        const areaStr = area.value.trim();

        if (!valueStr || parseFloat(valueStr) <= 0) {
            alert('Por favor, informe o valor do imóvel.');
            propertyValue.focus();
            return;
        }

        if (!areaStr || parseFloat(areaStr) <= 0) {
            alert('Por favor, informe a área construída.');
            area.focus();
            return;
        }

        // Coletar dados
        const value: number = parseFloat(valueStr);
        const areaValue: number = parseFloat(areaStr);
        const age: number = ownerAge.value ? parseInt(ownerAge.value) : 0;
        const cityValue: string = city.value;
        const usageValue: string = usage.value;

        // Cálculo
        const iptu: number = calculateIPTU(value, cityValue, areaValue, usageValue, age);
        const itbi: number = calculateITBI(value, cityValue);
        const cleaning: number = calculateCleaningTax(cityValue, areaValue);
        const fire: number = calculateFireTax(cityValue, areaValue);
        const condo: number = calculateCondoFee(value, areaValue);

        // Totais e Economia
        const totalAnnual: number = iptu + cleaning + fire + condo;
        const savings: number = calculateSavings(totalAnnual, usageValue, age);

        // Atualizar resultados
        iptuResult.textContent = formatCurrency(iptu);
        itbiResult.textContent = formatCurrency(itbi);
        cleaningResult.textContent = formatCurrency(cleaning);
        fireResult.textContent = formatCurrency(fire);
        
        iptuDetail.textContent = formatCurrency(iptu);
        cleaningDetail.textContent = formatCurrency(cleaning);
        fireDetail.textContent = formatCurrency(fire);
        condoDetail.textContent = formatCurrency(condo);
        totalDetail.textContent = formatCurrency(totalAnnual);
        savingsResult.textContent = formatCurrency(savings);
        
        // Atualizar comparação
        const manualCalculation: number = totalAnnual * 1.15;
        const systemCalculation: number = totalAnnual - savings;
        
        manualTotal.textContent = formatCurrency(manualCalculation);
        systemTotal.textContent = formatCurrency(systemCalculation);
        comparisonSavings.textContent = `Economia de ${formatCurrency(manualCalculation - systemCalculation)}`;
    };

    const handleReset = (): void => {
        propertyValue.value = '';
        area.value = '';
        ownerAge.value = '';
        
        const resetText = (element: HTMLElement) => element.textContent = 'R$ 0,00';

        resetText(iptuResult);
        resetText(itbiResult);
        resetText(cleaningResult);
        resetText(fireResult);
        
        resetText(iptuDetail);
        resetText(cleaningDetail);
        resetText(fireDetail);
        resetText(condoDetail);
        resetText(totalDetail);
        resetText(savingsResult);
        
        resetText(manualTotal);
        resetText(systemTotal);
        comparisonSavings.textContent = 'Economia de R$ 0,00';
    };

    // Lógica de Menu Mobile (Adaptada, mas será ignorada se você usar Bootstrap)
    if (mobileMenu && nav) {
        mobileMenu.addEventListener('click', () => {
            nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
        });

        const navLinks = document.querySelectorAll('nav ul li a') as NodeListOf<HTMLAnchorElement>;
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    nav.style.display = 'none';
                }
            });
        });

        const adjustMenu = (): void => {
            if (window.innerWidth > 768) {
                nav.style.display = 'flex';
            }
        };
        
        window.addEventListener('resize', adjustMenu);
        adjustMenu();
    }
    
    // ----------------------------------------------------------------------
    // 4. Inicialização de Eventos
    // ----------------------------------------------------------------------

    // Garantindo que os botões existem antes de adicionar event listeners
    if (calculateBtn) {
        calculateBtn.addEventListener('click', handleCalculate);
    } else {
        console.error("Elemento 'calculateBtn' não encontrado.");
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', handleReset);
    } else {
        console.error("Elemento 'resetBtn' não encontrado.");
    }
  }
}
