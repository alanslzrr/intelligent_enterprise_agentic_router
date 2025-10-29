"""
Sistema de Visualización de Arquitectura Multiagente

Genera representaciones gráficas de la arquitectura del sistema de routing
y clasificación de comunicaciones empresariales.

Uso:
    python visualize_agents.py

Salidas generadas:
    - router_architecture_complete.png: Diagrama completo del sistema
    - router_architecture_complete.dot: Código fuente DOT editable
    - agent_graphs/: Grafos individuales por agente
"""

import os
import sys
from pathlib import Path

try:
    from agents.extensions.visualization import draw_graph, get_main_graph
except ImportError:
    print("Error: Dependencia de visualización no encontrada")
    print("Ejecutar: pip install 'openai-agents[viz]'")
    sys.exit(1)

try:
    from router import (
        guardrails_agent,
        intent_agent,
        cv_extract_agent,
        cv_match_agent,
        owner_map_agent,
        sales_extract_agent,
        draft_reject_agent,
        draft_hr_forward_agent,
        draft_sales_forward_agent,
        draft_generic_ack_agent,
        hr_reject_packager,
        hr_forward_packager,
        sales_packager,
        events_packager,
        other_packager,
    )
except ImportError as e:
    print(f"Error importando agentes: {e}")
    print("Verificar que router.py esté en el mismo directorio")
    sys.exit(1)


def visualize_individual_agents():
    """Genera grafos individuales para cada agente del sistema."""
    print("\nGenerando visualizaciones individuales...")
    
    output_dir = Path("agent_graphs")
    output_dir.mkdir(exist_ok=True)
    
    agents = {
        "guardrails": guardrails_agent,
        "intent": intent_agent,
        "cv_extract": cv_extract_agent,
        "cv_match": cv_match_agent,
        "owner_map": owner_map_agent,
        "sales_extract": sales_extract_agent,
        "draft_reject": draft_reject_agent,
        "draft_hr_forward": draft_hr_forward_agent,
        "draft_sales_forward": draft_sales_forward_agent,
        "draft_generic_ack": draft_generic_ack_agent,
    }
    
    for name, agent in agents.items():
        filename = str(output_dir / f"agent_{name}")
        try:
            graph = draw_graph(agent, filename=filename)
            png_file = filename + ".png"
            if not Path(png_file).exists():
                try:
                    import graphviz
                    dot_code = get_main_graph(agent)
                    g = graphviz.Source(dot_code)
                    g.render(filename, format="png", cleanup=True)
                    print(f"  Generado: {name} -> {png_file}")
                except Exception as render_error:
                    print(f"  Error al renderizar {name}: {render_error}")
            else:
                print(f"  Generado: {name} -> {png_file}")
        except Exception as e:
            print(f"  Error en {name}: {e}")


def visualize_complete_system():
    """
    Genera visualización del punto de entrada del sistema.
    
    Nota: Arquitectura de orquestación secuencial.
    Para visualización completa, utilizar create_conceptual_diagram().
    """
    print("\nGenerando visualización del sistema completo...")
    print("Guardando grafo del agente de entrada (Guardrails)...")
    try:
        graph = draw_graph(guardrails_agent, filename="router_entry_point")
        print("  Guardado: router_entry_point.png")
        return graph
    except Exception as e:
        print(f"  Error: {e}")
        return None


def create_conceptual_diagram():
    """
    Genera diagrama conceptual completo de la arquitectura del sistema.
    Utiliza Graphviz para representar todos los flujos y decisiones.
    """
    print("\nGenerando diagrama conceptual de la arquitectura...")
    
    try:
        import graphviz
    except ImportError:
        print("Error: Graphviz no está instalado")
        print("Descargar desde: https://graphviz.org/download/")
        return
    
    dot = graphviz.Digraph(
        comment='Arquitectura del Sistema de Routing Multiagente',
        format='png',
        engine='dot'
    )
    
    dot.attr(rankdir='TB', splines='ortho', nodesep='0.8', ranksep='1.0')
    dot.attr('node', fontname='Arial', fontsize='11')
    dot.attr('edge', fontname='Arial', fontsize='9', penwidth='1.5')
    
    dot.node('start', '__START__', shape='ellipse', style='filled', 
             fillcolor='lightblue', width='1.2', height='0.5')
    
    dot.node('guardrails', 'Guardrails\nAgent', shape='box', style='filled,rounded',
             fillcolor='#FFE5B4', width='2', height='0.8')
    
    dot.node('guard_check', 'Pass?', shape='diamond', style='filled',
             fillcolor='lightgray', width='1', height='0.6')
    
    dot.node('intent', 'Intent\nClassifier', shape='box', style='filled,rounded',
             fillcolor='#FFE5B4', width='2', height='0.8')
    
    dot.node('intent_router', 'Route by\nCategory', shape='diamond', style='filled',
             fillcolor='lightgray', width='1.5', height='0.8')
    
    # CV Branch
    with dot.subgraph(name='cluster_cv') as c:
        c.attr(label='CV Pipeline', style='filled', color='lightgray', fillcolor='#E8F4F8')
        c.node('cv_extract', 'CV\nExtractor', shape='box', style='filled,rounded',
               fillcolor='#90EE90', width='1.8')
        c.node('cv_match', 'CV\nMatcher', shape='box', style='filled,rounded',
               fillcolor='#90EE90', width='1.8')
        c.node('cv_decision', 'Match\nOK?', shape='diamond', style='filled',
               fillcolor='white', width='1')
        c.node('draft_accept', 'Draft HR\nForward', shape='box', style='filled,rounded',
               fillcolor='#98FB98', width='1.8')
        c.node('draft_reject', 'Draft HR\nReject', shape='box', style='filled,rounded',
               fillcolor='#FFA07A', width='1.8')
        c.node('hr_pkg_fwd', 'Packager\nHR Forward', shape='box', style='filled',
               fillcolor='#D3D3D3', width='1.8')
        c.node('hr_pkg_rej', 'Packager\nHR Reject', shape='box', style='filled',
               fillcolor='#D3D3D3', width='1.8')
    
    # Sales Branch
    with dot.subgraph(name='cluster_sales') as c:
        c.attr(label='Sales Pipeline', style='filled', color='lightgray', fillcolor='#FFF8DC')
        c.node('sales_extract', 'Sales\nExtractor', shape='box', style='filled,rounded',
               fillcolor='#90EE90', width='1.8')
        c.node('draft_sales', 'Draft Sales\nForward', shape='box', style='filled,rounded',
               fillcolor='#98FB98', width='1.8')
        c.node('sales_pkg', 'Packager\nSales', shape='box', style='filled',
               fillcolor='#D3D3D3', width='1.8')
    
    # Events/Other Branch
    with dot.subgraph(name='cluster_other') as c:
        c.attr(label='Events/Other Pipeline', style='filled', color='lightgray', fillcolor='#F0E68C')
        c.node('owner_map', 'Owner\nMapping', shape='box', style='filled,rounded',
               fillcolor='#90EE90', width='1.8')
        c.node('draft_generic', 'Draft Generic\nAck', shape='box', style='filled,rounded',
               fillcolor='#98FB98', width='1.8')
        c.node('events_pkg', 'Packager\nEvents', shape='box', style='filled',
               fillcolor='#D3D3D3', width='1.8')
        c.node('other_pkg', 'Packager\nOther', shape='box', style='filled',
               fillcolor='#D3D3D3', width='1.8')
    
    # Nodo final
    dot.node('end', '__END__', shape='ellipse', style='filled',
             fillcolor='lightblue', width='1.2', height='0.5')
    
    # Edges - Main flow
    dot.edge('start', 'guardrails', label='Email in')
    dot.edge('guardrails', 'guard_check')
    dot.edge('guard_check', 'intent', label='✓ Safe')
    dot.edge('guard_check', 'end', label='✗ Block', color='red', style='dashed')
    dot.edge('intent', 'intent_router')
    
    # CV Branch edges
    dot.edge('intent_router', 'cv_extract', label='CV', color='blue')
    dot.edge('cv_extract', 'cv_match')
    dot.edge('cv_match', 'cv_decision')
    dot.edge('cv_decision', 'draft_accept', label='Match ≥70%', color='green')
    dot.edge('cv_decision', 'draft_reject', label='No match', color='orange')
    dot.edge('draft_accept', 'hr_pkg_fwd')
    dot.edge('draft_reject', 'hr_pkg_rej')
    dot.edge('hr_pkg_fwd', 'end')
    dot.edge('hr_pkg_rej', 'end')
    
    # Sales Branch edges
    dot.edge('intent_router', 'sales_extract', label='Sales', color='blue')
    dot.edge('sales_extract', 'draft_sales')
    dot.edge('draft_sales', 'sales_pkg')
    dot.edge('sales_pkg', 'end')
    
    # Events/Other edges
    dot.edge('intent_router', 'owner_map', label='Event/Other', color='blue')
    dot.edge('owner_map', 'draft_generic')
    dot.edge('draft_generic', 'events_pkg', label='Event', constraint='false')
    dot.edge('draft_generic', 'other_pkg', label='Other', constraint='false')
    dot.edge('events_pkg', 'end')
    dot.edge('other_pkg', 'end')
    
    try:
        output_file = 'router_architecture_complete'
        
        dot.render(output_file, format='png', cleanup=True)
        
        png_file = f"{output_file}.png"
        if Path(png_file).exists():
            print(f"  Guardado: {png_file}")
        else:
            print(f"  Advertencia: Archivo PNG no encontrado en: {png_file}")
        
        with open(f'{output_file}.dot', 'w', encoding='utf-8') as f:
            f.write(dot.source)
        print(f"  Código fuente: {output_file}.dot")
        
        return dot
    except Exception as e:
        print(f"  Error: {e}")
        print("  Verificar que Graphviz esté instalado y en el PATH del sistema")
        return None


def print_agent_summary():
    """Genera resumen estadístico de todos los agentes del sistema."""
    print("\n" + "="*70)
    print("RESUMEN DE AGENTES - Sistema de Routing Multiagente")
    print("="*70)
    
    agents = [
        ("Guardrails", guardrails_agent, "Seguridad y moderación"),
        ("Intent", intent_agent, "Clasificación de intención"),
        ("CV Extract", cv_extract_agent, "Extracción de CVs"),
        ("CV Match", cv_match_agent, "Matching con vacantes"),
        ("Owner Map", owner_map_agent, "Mapeo de propietarios"),
        ("Sales Extract", sales_extract_agent, "Extracción de leads"),
        ("Draft Reject", draft_reject_agent, "Email rechazo CV"),
        ("Draft HR Forward", draft_hr_forward_agent, "Email forward HR"),
        ("Draft Sales Forward", draft_sales_forward_agent, "Email forward Sales"),
        ("Draft Generic", draft_generic_ack_agent, "Email genérico"),
        ("HR Reject Packager", hr_reject_packager, "Empaquetado rechazo"),
        ("HR Forward Packager", hr_forward_packager, "Empaquetado forward HR"),
        ("Sales Packager", sales_packager, "Empaquetado sales"),
        ("Events Packager", events_packager, "Empaquetado eventos"),
        ("Other Packager", other_packager, "Empaquetado otros"),
    ]
    
    print(f"\n{'Agente':<25} {'Modelo':<15} {'Descripción':<30}")
    print("-" * 70)
    for name, agent, desc in agents:
        model = getattr(agent, 'model', 'N/A')
        print(f"{name:<25} {model:<15} {desc:<30}")
    
    print("\n" + "="*70)
    print(f"Total de agentes: {len(agents)}")
    print("="*70 + "\n")


def main():
    """Función principal - Generación de visualizaciones del sistema."""
    print("\n" + "="*70)
    print("VISUALIZACION DE ARQUITECTURA MULTIAGENTE")
    print("Sistema de Routing y Clasificación de Comunicaciones")
    print("="*70)
    
    print_agent_summary()
    
    print("\nOpción 1: Diagrama Conceptual Completo")
    print("(Representa toda la arquitectura con decisiones y flujos)")
    conceptual = create_conceptual_diagram()
    
    print("\nOpción 2: Grafos Individuales de Agentes")
    print("(Genera un grafo por cada agente del sistema)")
    response = input("Generar grafos individuales? (s/n): ").lower()
    if response == 's':
        visualize_individual_agents()
    
    print("\nOpción 3: Punto de Entrada del Sistema")
    print("(Visualiza el agente Guardrails como entrada)")
    response = input("Generar grafo de entrada? (s/n): ").lower()
    if response == 's':
        visualize_complete_system()
    
    print("\n" + "="*70)
    print("Proceso de visualización completado")
    print("="*70)
    print("\nArchivos generados:")
    print("  - router_architecture_complete.png (diagrama principal)")
    print("  - router_architecture_complete.dot (código fuente editable)")
    print("  - agent_graphs/*.png (grafos individuales, si se solicitaron)")
    print("\nDocumentación de referencia:")
    print("  - Graphviz: https://graphviz.org/")
    print("  - OpenAI Agents SDK: https://platform.openai.com/docs/agents")
    print()


if __name__ == "__main__":
    main()
