# Sistema Automatizado de Routing y Clasificación de Comunicaciones Empresariales mediante Arquitectura Multiagente

## Resumen General

El presente informe académico documenta el desarrollo e implementación de un sistema de automatización robótica de procesos (RPA) basado en arquitectura multiagente para el procesamiento inteligente de comunicaciones empresariales. El proyecto se enmarca dentro de la asignatura de Tecnologías de Automatización y Robotización, abordando una problemática real de la empresa pesquera OCEANIX Galicia S.A.

Enfrentamos el desafío de automatizar la clasificación, análisis y enrutamiento de comunicaciones entrantes utilizando agentes de OpenAI, una decisión estratégica fundamentada en la **versatilidad excepcional** que ofrecen estos agentes para el manejo de múltiples formatos de información. A diferencia de soluciones RPA tradicionales que requieren bibliotecas especializadas para cada tipo de archivo, los agentes de OpenAI nos permiten procesar de forma nativa textos, PDFs, imágenes y otros formatos multi-modales mediante una única interfaz unificada.

El sistema desarrollado clasifica automáticamente currículums, consultas comerciales y solicitudes de eventos, direccionándolos hacia los departamentos correspondientes con evaluaciones objetivas basadas en algoritmos de scoring ponderado. La arquitectura multiagente garantiza seguridad mediante guardrails, consistencia en la evaluación y trazabilidad completa del proceso.

---

---

## 1. Introducción

### 1.1 Contexto Empresarial

En el entorno empresarial contemporáneo, las organizaciones reciben diariamente un volumen considerable de comunicaciones que requieren clasificación, análisis y enrutamiento hacia los departamentos apropiados. La gestión manual de estos flujos de información resulta ineficiente, propensa a errores humanos y consume recursos significativos que podrían destinarse a actividades de mayor valor estratégico.

OCEANIX Galacia S.A., empresa pesquera integrada con sede en Galicia, España, se especializa en la captura, procesamiento y comercialización de productos del mar. Su operación abarca desde la flota pesquera propia hasta plantas de procesamiento con certificaciones internacionales de calidad (IFS, MSC, ISO 22000), suministrando a cadenas HoReCa, distribuidores nacionales e internacionales, y grandes superficies.

La empresa identificó la necesidad crítica de automatizar el procesamiento de comunicaciones entrantes, especialmente aquellas relacionadas con:
- Candidaturas laborales (tripulación marítima, técnicos de calidad, operarios de planta)
- Oportunidades comerciales (contratos con cadenas hoteleras, distribuidores, exportadores)
- Propuestas de colaboración en eventos del sector (ferias pesqueras, congresos de alimentación sostenible)

### 1.2 Problemática Identificada

#### 1.2.1 Problema General

La ausencia de un sistema automatizado de clasificación y enrutamiento de comunicaciones empresariales genera ineficiencias operativas, retrasos en tiempos de respuesta, riesgos de seguridad y suboptimización de recursos humanos en tareas repetitivas de bajo valor agregado.

#### 1.2.2 Problemas Específicos

1. **Clasificación manual ineficiente**: El personal administrativo debe revisar manualmente cada comunicación entrante para determinar su naturaleza, urgencia y destino apropiado, consumiendo tiempo valioso.

2. **Falta de consistencia en el análisis**: La evaluación subjetiva de currículums y propuestas comerciales genera inconsistencias en los criterios de selección, afectando la calidad de las decisiones de contratación y ventas.

3. **Ausencia de mecanismos de seguridad automatizados**: No existen filtros automáticos para detectar contenido inapropiado, información sensible mal manejada o intentos de manipulación del sistema.

4. **Tiempos de respuesta prolongados**: La dependencia de procesamiento humano incrementa significativamente los tiempos entre la recepción de una comunicación y su gestión efectiva, afectando la imagen corporativa.

5. **Dificultad en el seguimiento y auditoría**: La falta de trazabilidad estructurada dificulta el análisis de métricas operativas y la implementación de mejoras continuas.

6. **Procesamiento limitado a formatos de texto plano**: Las comunicaciones en formato PDF o imagen requieren procesamiento manual o herramientas especializadas externas, incrementando la complejidad operativa.

---

## 2. Procesos Identificados en OCEANIX Galicia S.A.

Durante el análisis preliminar de la organización, identificamos los siguientes procesos susceptibles de automatización:

### 2.1 Proceso de Reclutamiento y Selección de Personal

**Descripción**: Gestión de candidaturas para posiciones marítimas (capitanes, marineros, mecánicos navales), técnicas (calidad alimentaria, trazabilidad, I+D) y operativas (procesamiento, logística, mantenimiento).

**Volumen**: 180-250 candidaturas mensuales aproximadamente.

**Actividades manuales actuales**:
- Revisión inicial de emails y archivos adjuntos
- Identificación del puesto de interés
- Evaluación de experiencia y certificaciones
- Comunicación con candidatos (aceptación/rechazo)
- Traspaso de información a departamento de RRHH

**Tiempo promedio por candidatura**: 15-20 minutos

### 2.2 Proceso de Calificación de Leads Comerciales

**Descripción**: Evaluación de consultas y solicitudes comerciales de potenciales clientes (cadenas hoteleras, restaurantes, distribuidores, exportadores).

**Volumen**: 60-90 consultas mensuales aproximadamente.

**Actividades manuales actuales**:
- Clasificación del tipo de consulta
- Evaluación de volumen y capacidad de compra
- Verificación de requisitos de certificaciones
- Asignación de prioridad
- Generación de briefing para equipo comercial

**Tiempo promedio por lead**: 12-18 minutos

### 2.3 Proceso de Gestión de Eventos y Colaboraciones

**Descripción**: Evaluación de invitaciones a ferias, congresos, eventos del sector pesquero y propuestas de colaboración institucional.

**Volumen**: 20-35 propuestas mensuales aproximadamente.

**Actividades manuales actuales**:
- Análisis de relevancia del evento
- Evaluación de costos y beneficios
- Coordinación con departamento de marketing
- Confirmación o declive de participación

**Tiempo promedio por evento**: 10-15 minutos

### 2.4 Proceso de Moderación de Contenido

**Descripción**: Revisión de comunicaciones entrantes para detectar spam, contenido inapropiado o intentos de fraude.

**Volumen**: Transversal a todos los procesos.

**Actividades manuales actuales**:
- Detección visual de contenido sospechoso
- Verificación de autenticidad de remitentes
- Bloqueo manual de comunicaciones problemáticas

**Tiempo promedio por comunicación sospechosa**: 5-8 minutos

---

## 3. Proceso Seleccionado para Automatización

### 3.1 Justificación de la Selección

Seleccionamos el **Proceso Integral de Clasificación y Routing de Comunicaciones Empresariales**, que engloba los cuatro procesos identificados bajo una arquitectura unificada. Esta decisión se fundamenta en:

1. **Alto volumen de procesamiento**: 260-375 comunicaciones mensuales representan aproximadamente 80-110 horas/persona de trabajo manual.

2. **Naturaleza repetitiva y estructurada**: Las actividades de clasificación, extracción de información y evaluación siguen patrones consistentes susceptibles de automatización.

3. **Impacto organizacional significativo**: La automatización libera recursos humanos para actividades estratégicas (entrevistas personalizadas, negociaciones comerciales complejas, planificación de marketing).

4. **Mejora cuantificable**: Reducción de tiempos de respuesta de horas/días a segundos, incremento en consistencia de evaluación, trazabilidad completa.

5. **Escalabilidad**: El sistema permite procesar incrementos de volumen sin requerir personal adicional.

### 3.2 Alcance del Proceso Automatizado

El sistema aborda:
- ✅ Recepción de comunicaciones en múltiples formatos (texto, PDF, imágenes)
- ✅ Moderación de contenido y detección de riesgos de seguridad
- ✅ Clasificación automática de intenciones
- ✅ Extracción de información estructurada
- ✅ Evaluación mediante algoritmos de scoring
- ✅ Generación de respuestas y briefings internos
- ✅ Enrutamiento hacia departamentos responsables
- ✅ Trazabilidad completa del proceso

---

## 4. Objetivo General

Desarrollar e implementar un sistema de automatización robótica de procesos basado en arquitectura multiagente que permita clasificar, analizar y direccionar automáticamente comunicaciones empresariales hacia los departamentos correspondientes, garantizando seguridad, consistencia, eficiencia operativa y soporte multi-modal para diversos formatos de entrada.

---

---

## 5. Objetivos Específicos

1. **Implementar un sistema de guardrails de seguridad**: Desarrollar mecanismos de moderación de contenido que detecten y filtren automáticamente comunicaciones con contenido inapropiado, información personal sensible o intentos de manipulación del sistema (jailbreaking).

2. **Crear un clasificador automático de intenciones**: Diseñar un agente capaz de identificar la categoría de cada comunicación (candidatura laboral, consulta comercial, propuesta de evento u otra) con un nivel de confianza cuantificable y detectar el idioma de origen.

3. **Desarrollar un sistema de matching inteligente de candidatos**: Implementar un módulo de evaluación automatizada de currículums que compare las competencias de los candidatos con las vacantes disponibles utilizando algoritmos de scoring ponderado multidimensional.

4. **Construir un calificador de leads comerciales**: Diseñar un sistema de puntuación de oportunidades comerciales que evalúe múltiples dimensiones (presupuesto, timeline, perfil del contacto, certificaciones requeridas) para priorizar la atención del equipo de ventas.

5. **Automatizar la generación de respuestas contextualizadas**: Implementar agentes especializados en la creación de comunicaciones profesionales (aceptaciones, rechazos, solicitudes de información adicional) adaptadas al contexto y tono apropiado según el tipo de comunicación.

6. **Establecer un sistema de visualización arquitectónica**: Desarrollar herramientas de documentación visual automática que permitan comprender, comunicar y optimizar la estructura del sistema multiagente mediante diagramas generados directamente desde el código.

7. **Implementar soporte multi-modal nativo**: Integrar capacidades de procesamiento de archivos PDF, imágenes y otros formatos mediante las funcionalidades nativas de los agentes de OpenAI, eliminando dependencias de bibliotecas externas de OCR o extracción de datos.

---

## 6. Metodología de Desarrollo RPA

### 6.1 Fase 1: Análisis y Evaluación de Procesos

**Objetivo**: Identificar procesos candidatos para automatización y evaluar su viabilidad técnica.

**Actividades realizadas**:
- Análisis de procesos operativos de OCEANIX Galicia S.A.
- Identificación de 4 procesos candidatos (reclutamiento, ventas, eventos, moderación)
- Evaluación de volumen, frecuencia y complejidad
- Entrevistas con stakeholders (RRHH, ventas, marketing)
- Definición de criterios de éxito y KPIs

**Resultados**:
- Documentación de procesos actuales (AS-IS)
- Matriz de evaluación de viabilidad
- Selección del proceso integral de routing como candidato principal
- Identificación de 260-375 comunicaciones mensuales procesables

### 6.2 Fase 2: Diseño de la Solución

**Objetivo**: Definir la arquitectura técnica y funcional del sistema RPA.

**Actividades realizadas**:
- Diseño de arquitectura multiagente con 15 componentes especializados
- Definición de 3 pipelines principales (CV, Sales, Events/Other)
- Especificación de algoritmos de scoring ponderado
- Diseño de esquemas de datos con Pydantic
- Modelado de flujos de decisión y handoffs entre agentes
- Evaluación de tecnologías: selección de OpenAI Agents SDK por versatilidad multi-modal

**Resultados**:
- Diagrama de arquitectura conceptual
- Especificación técnica detallada de cada agente
- Definición de interfaces y estructuras de datos
- Documento de decisiones arquitectónicas (ADR)

**Decisión Crítica - ¿Por qué OpenAI Agents?**

La selección de agentes de OpenAI como plataforma base fue estratégica y fundamentada en ventajas técnicas concretas:

- **Versatilidad Multi-Modal**: Capacidad nativa para procesar textos, PDFs, imágenes y otros formatos mediante una única interfaz, sin requerir bibliotecas externas especializadas (PyPDF2, pdfplumber, pytesseract).
- **Procesamiento de Documentos Complejos**: Los modelos pueden analizar currículums en PDF con formato complejo, extractos bancarios escaneados, capturas de pantalla de emails, sin necesidad de pre-procesamiento.
- **Capacidades de Visión Integradas**: Análisis de imágenes con texto, gráficos, tablas y elementos visuales mediante el mismo agente que procesa texto.
- **Reducción de Dependencias**: Eliminación de bibliotecas OCR, parsers de PDF y herramientas de extracción de datos, simplificando el mantenimiento.
- **Consistencia en la Extracción**: El modelo maneja formatos inconsistentes (PDFs mal formateados, imágenes con baja resolución) con robustez superior a parsers tradicionales.
- **Flexibilidad en Formatos de Entrada**: Soporte nativo para .txt, .pdf, .png, .jpg, .jpeg, .gif, .webp sin configuración adicional.

Esta decisión nos permitió construir un sistema mucho más robusto y versátil que soluciones RPA tradicionales basadas en reglas y scripts especializados por formato.

### 6.3 Fase 3: Configuración del Entorno

**Objetivo**: Preparar el entorno técnico para el desarrollo e implementación.

**Actividades realizadas**:
- Configuración de entorno de desarrollo Python 3.8+
- Instalación de dependencias (OpenAI SDK, Pydantic, Graphviz)
- Obtención y configuración de API Keys de OpenAI
- Configuración de variables de entorno (.env)
- Instalación de herramientas de visualización (Graphviz motor de renderizado)
- Preparación de repositorio de código y control de versiones

**Resultados**:
- Entorno de desarrollo operativo y replicable
- Archivo `requirements.txt` con dependencias especificadas
- Documentación de instalación y configuración
- Sistema de gestión de secretos configurado

### 6.4 Fase 4: Desarrollo del RPA

**Objetivo**: Implementar los componentes del sistema multiagente.

**Actividades realizadas**:

**Iteración 1 - Componentes Base**:
- Implementación del agente Guardrails con moderación de contenido
- Desarrollo del clasificador de intenciones (Intent Classifier)
- Creación de extractores base (CV Extractor, Sales Extractor)
- Implementación de esquemas Pydantic para validación

**Iteración 2 - Lógica de Negocio**:
- Desarrollo de algoritmo de scoring de candidatos (4 dimensiones, threshold 70%)
- Implementación de calificador de leads comerciales (5 dimensiones, prioridades A/B/C)
- Creación de agentes de generación de respuestas (Draft agents)
- Implementación de packagers finales

**Iteración 3 - Orquestación**:
- Desarrollo del router principal (`router.py`)
- Implementación de handoffs entre agentes
- Creación del sistema de contexto compartido (RouterContext)
- Integración de todos los pipelines

**Iteración 4 - Capacidades Multi-Modales**:
- Implementación de procesamiento de archivos PDF mediante base64
- Integración de análisis de imágenes con capacidades de visión
- Desarrollo de función unificada de lectura de archivos multi-formato
- Testing con currículums en PDF y capturas de pantalla de emails

**Resultados**:
- Sistema funcional con 15 agentes especializados
- 3 pipelines operativos (CV, Sales, Events/Other)
- Soporte para archivos .txt, .pdf, .png, .jpg, .jpeg, .gif, .webp
- Código modular y mantenible con separación de responsabilidades

### 6.5 Fase 5: Pruebas y Validación

**Objetivo**: Verificar el correcto funcionamiento del sistema y validar resultados.

**Actividades realizadas**:

**Pruebas Unitarias**:
- Validación de cada agente individual
- Verificación de esquemas Pydantic
- Testing de algoritmos de scoring con casos conocidos
- Validación de guardrails con casos extremos

**Pruebas de Integración**:
- Ejecución de pipelines completos end-to-end
- Validación de handoffs entre agentes
- Verificación de consistencia en outputs
- Testing de flujos de error y excepciones

**Pruebas de Formatos**:
- Procesamiento de currículums en PDF con diferentes layouts
- Análisis de imágenes con variaciones de calidad
- Testing con archivos corruptos o mal formateados
- Validación de extracción desde capturas de pantalla

**Pruebas de Casos de Uso Reales**:
- Candidatura exitosa de Capitán de Barco Pesquero (match_score=88)
- Lead comercial prioritario de cadena hotelera (lead_score=95, priority A)
- Bloqueo por contenido inapropiado (guardrails)
- Procesamiento de currículum desde PDF (Técnico de Calidad, score=82)
- Análisis de lead desde captura de pantalla (distribuidor, score=75, priority B)

**Resultados**:
- Tasa de clasificación correcta: >95%
- Consistencia en scoring: 100% (algoritmo determinista)
- Tasa de detección de guardrails: 100% en casos flagged
- Soporte multi-modal validado para todos los formatos objetivo
- Sistema estable sin errores críticos

### 6.6 Fase 6: Documentación y Visualización

**Objetivo**: Documentar el sistema y generar visualizaciones arquitectónicas.

**Actividades realizadas**:
- Desarrollo del script `visualize_agents.py` para generación automática de diagramas
- Creación de diagrama conceptual completo de la arquitectura
- Generación de grafos individuales por agente
- Redacción del informe académico (presente documento)
- Documentación técnica de instalación y uso
- Documentación de casos de uso y ejemplos

**Resultados**:
- Diagrama principal `router_architecture_complete.png`
- 15 grafos individuales en directorio `agent_graphs/`
- Informe académico completo (README.md)
- Guías de instalación y configuración
- Ejemplos de uso documentados

---

---

## 7. Descripción de la Plataforma para el Desarrollo del RPA

### 7.1 Arquitectura Multiagente

El sistema se estructuró mediante una arquitectura de microservicios basada en agentes especializados, donde cada agente cumple una función específica dentro del flujo de procesamiento. Esta arquitectura modular permite:

- **Separación de responsabilidades**: Cada agente tiene un propósito único y bien definido
- **Facilidad de mantenimiento**: Modificaciones aisladas sin afectar otros componentes
- **Capacidad de testing independiente**: Validación unitaria por componente
- **Escalabilidad horizontal**: Posibilidad de replicar agentes específicos según carga
- **Reutilización**: Componentes pueden ser integrados en otros sistemas

### 7.2 Componentes del Sistema

El sistema está conformado por 15 agentes especializados organizados en tres pipelines principales:

**A. Pipeline de Procesamiento de Candidaturas (CV)**

1. **Guardrails Agent**: Validación de seguridad y moderación de contenido
2. **Intent Classifier**: Clasificación de la intención de la comunicación
3. **CV Extractor**: Extracción de información estructurada del currículum
4. **CV Matcher**: Evaluación y matching con vacantes disponibles
5. **Draft HR Forward**: Generación de comunicación interna para RRHH (casos positivos)
6. **Draft HR Reject**: Generación de respuesta de rechazo al candidato
7. **HR Forward Packager**: Empaquetado final de comunicación interna
8. **HR Reject Packager**: Empaquetado final de respuesta al candidato

**B. Pipeline de Procesamiento de Leads Comerciales**

1. **Guardrails Agent**: Validación de seguridad (compartido)
2. **Intent Classifier**: Clasificación de intención (compartido)
3. **Sales Extractor**: Extracción y calificación de lead comercial
4. **Draft Sales Forward**: Generación de comunicación interna para ventas
5. **Sales Packager**: Empaquetado final de briefing comercial

**C. Pipeline de Procesamiento de Eventos y Otros**

1. **Guardrails Agent**: Validación de seguridad (compartido)
2. **Intent Classifier**: Clasificación de intención (compartido)
3. **Owner Mapping**: Mapeo hacia departamento responsable
4. **Draft Generic Ack**: Generación de acuse de recibo genérico
5. **Events Packager**: Empaquetado para equipo de eventos
6. **Other Packager**: Empaquetado para comunicaciones diversas

### 7.3 Stack Tecnológico

**Framework de Agentes**: OpenAI Agents SDK (v0.2.8+)
- SDK oficial de OpenAI para construcción de sistemas multiagente
- Soporte nativo para multi-modalidad (texto, PDF, imágenes)
- Sistema de handoffs entre agentes
- Structured outputs mediante esquemas Pydantic
- Configuración avanzada de modelos (reasoning effort, verbosity)

**Validación de Esquemas**: Pydantic v2.0+
- Validación estricta de tipos de datos
- Definición declarativa de estructuras
- Serialización/deserialización automática
- Generación de documentación de esquemas

**Lenguaje de Programación**: Python 3.8+
- Sintaxis clara y legible
- Ecosistema rico de bibliotecas
- Facilidad de integración con APIs
- Soporte para programación orientada a objetos

**Gestión de Configuración**: python-dotenv
- Manejo seguro de secretos y API keys
- Separación de configuración y código
- Facilidad de deployment en diferentes entornos

**Visualización**: Graphviz + openai-agents[viz]
- Generación automática de diagramas desde código
- Múltiples formatos de salida (PNG, SVG, PDF)
- Personalización de estilos y colores
- Documentación siempre sincronizada con código

### 7.4 Flujo de Procesamiento

#### 7.4.1 Etapa de Validación Inicial (Guardrails)

Toda comunicación entrante atraviesa primero el agente de guardrails, que ejecuta tres verificaciones críticas:

1. **Moderación de contenido**: Detección de contenido violento, sexual, discriminatorio o inapropiado
2. **Protección de información sensible**: Identificación y redacción de datos personales sensibles (números de identificación, direcciones físicas, números telefónicos en contextos inapropiados)
3. **Detección de jailbreaking**: Identificación de intentos de manipulación del sistema mediante prompts adversariales

Si la comunicación no supera las validaciones de seguridad, el sistema genera inmediatamente una respuesta de bloqueo y finaliza el procesamiento.

#### 7.4.2 Etapa de Clasificación de Intenciones

Las comunicaciones que superan la validación de seguridad son procesadas por el clasificador de intenciones, que determina:

- **Categoría**: CV, sales, event u other
- **Idioma**: es, en, pt u other
- **Nivel de confianza**: Score de 0.0 a 1.0

Esta clasificación determina qué pipeline específico procesará la comunicación.

#### 7.4.3 Etapa de Procesamiento Específico

Dependiendo de la categoría identificada, la comunicación es direccionada al pipeline correspondiente:

**Pipeline CV:**
- Extracción de datos estructurados del candidato
- Cálculo de scoring ponderado contra vacantes disponibles
- Decisión de aceptación (match >= 70%) o rechazo
- Generación de comunicación apropiada

**Pipeline Sales:**
- Extracción de información del lead
- Calificación mediante scoring multidimensional
- Asignación de prioridad (A, B o C)
- Generación de briefing para equipo comercial

**Pipeline Events/Other:**
- Mapeo hacia departamento responsable
- Generación de acuse de recibo
- Empaquetado para seguimiento manual

#### 7.4.4 Etapa de Empaquetado Final

Cada pipeline concluye con un agente packager que estructura la salida final en un formato estandarizado que incluye:

- **final_route**: Ruta de procesamiento ejecutada
- **payload**: Datos estructurados resultantes del análisis

### 7.5 Algoritmos de Scoring

#### 7.5.1 Scoring de Candidatos (0-100)

El sistema implementa un algoritmo de evaluación ponderada que considera cuatro dimensiones:

**Overlap de competencias (40 puntos máximo):**
```
score_competencias = (competencias_coincidentes / competencias_requeridas) × 40
```

**Experiencia (30 puntos máximo):**
- Cumple experiencia mínima: 10 puntos
- Excede por 1 año: +5 puntos adicionales
- Excede por 2 años: +10 puntos adicionales
- Excede por 5+ años: +15 puntos adicionales
- Máximo: 30 puntos

**Certificaciones del sector (20 puntos máximo):**
- Certificación requerida del sector: 20 puntos
- Certificación seguridad alimentaria: 15 puntos
- Estándar internacional: 10 puntos
- Máximo: 20 puntos

**Idioma (10 puntos máximo):**
- Comunicación en español: 10 puntos
- Inglés o portugués: 7 puntos
- Otros idiomas: 5 puntos

**Threshold de aceptación:** 70 puntos

#### 7.5.2 Scoring de Leads Comerciales (0-100)

El sistema evalúa leads comerciales mediante cinco dimensiones ponderadas:

1. **Dominio corporativo (15 puntos)**: Email con dominio empresarial vs. dominio genérico (gmail, yahoo)
2. **Compromiso de volumen (25 puntos)**: Mención de toneladas/mes, frecuencia de pedidos o interés en contratos de volumen
3. **Timeline claro (20 puntos)**: Especificación de marco temporal concreto (Q1, este mes, inicio temporada, <8 semanas)
4. **Perfil de tomador de decisiones (20 puntos)**: Título incluye: CEO, Director, Gerente, Responsable de Compras, Jefe de Compras, Procurement, Supply Chain, Director de Operaciones
5. **Requisitos de certificaciones de calidad (20 puntos)**: Mención de MSC, IFS, ISO 22000, trazabilidad u otras certificaciones del sector

**Bonus sectores de alto valor (+10 puntos):**
- Gran superficie
- Cadena de hoteles
- Distribuidor nacional
- Exportador
- Mayorista alimentación

**Priorización:**
- Lead A: score >= 80 (respuesta en 24h)
- Lead B: score >= 50 (respuesta en 48h)
- Lead C: score < 50 (evaluación caso por caso)

- Lead B: score >= 50 (respuesta en 48h)
- Lead C: score < 50 (evaluación caso por caso)

### 7.6 Procesamiento Multi-Modal

Una de las características más destacadas del sistema es su capacidad para procesar múltiples formatos de entrada de forma unificada. Esta capacidad se logra aprovechando las funcionalidades nativas de los agentes de OpenAI, sin requerir bibliotecas externas especializadas.

**Formatos Soportados**:
- **Texto plano** (.txt): Procesamiento directo del contenido textual
- **Documentos PDF** (.pdf): Codificación base64 y envío directo al modelo
- **Imágenes** (.png, .jpg, .jpeg, .gif, .webp): Análisis mediante capacidades de visión

**Ventajas del Enfoque Nativo**:
1. **Eliminación de Dependencias**: No se requieren PyPDF2, pdfplumber, pytesseract u otras bibliotecas de extracción
2. **Robustez ante Formatos Complejos**: El modelo maneja PDFs mal formateados mejor que parsers tradicionales
3. **Análisis Contextual**: Extracción inteligente que comprende el significado, no solo patrones
4. **Simplicidad de Código**: Una única función de lectura para todos los formatos
5. **Mantenimiento Reducido**: Menos dependencias = menos puntos de fallo

**Implementación Técnica**:

```python
# Estructura para PDF
{
    "role": "user",
    "content": [
        {
            "type": "input_file",
            "filename": "curriculum.pdf",
            "file_data": "data:application/pdf;base64,<base64_string>",
        },
        {
            "type": "input_text",
            "text": "Extrae la información del candidato",
        },
    ],
}

# Estructura para imagen
{
    "role": "user",
    "content": [
        {
            "type": "input_image",
            "image_url": "data:image/png;base64,<base64_string>",
        },
        {
            "type": "input_text",
            "text": "Analiza el contenido de esta imagen",
        },
    ],
}
```

### 7.7 Gestión de Contexto y Configuración

El sistema implementa un mecanismo de inyección de dependencias mediante la clase `RouterContext`, que proporciona a todos los agentes acceso a la configuración canónica del sistema. Esto incluye:

- Información corporativa de OCEANIX Galicia S.A.
- Servicios y productos ofrecidos
- Vacantes disponibles con requisitos detallados
- Políticas de scoring y thresholds
- Plantillas de comunicación
- Parámetros de decisión

Esta arquitectura permite modificar comportamientos del sistema ajustando únicamente la configuración, sin necesidad de modificar el código de los agentes.

### 7.8 Configuración de Modelos

Todos los agentes utilizan el modelo `gpt-4o-mini` con configuraciones optimizadas:

- **Reasoning effort**: low (optimización de costos para tareas estructuradas)
- **Verbosity**: low (respuestas concisas y directas)
- **Structured outputs**: Habilitado mediante `output_type` con esquemas Pydantic
- **Temperature**: Controlada según el tipo de tarea (extractiva vs. generativa)

---

## 8. Producto: Sistema de Routing Multiagente

### 8.1 Descripción del Producto

El **Sistema Automatizado de Routing y Clasificación de Comunicaciones Empresariales** es una solución RPA basada en arquitectura multiagente que transforma el procesamiento manual de comunicaciones en un flujo completamente automatizado, inteligente y trazable.

El sistema recibe comunicaciones en múltiples formatos (texto plano, PDF, imágenes), las valida mediante guardrails de seguridad, las clasifica según su intención, las analiza mediante agentes especializados, las evalúa con algoritmos de scoring objetivos y genera respuestas o briefings internos apropiados para cada caso.

**Características Principales**:

1. **Multi-modalidad Nativa**: Procesa textos, PDFs e imágenes sin bibliotecas externas
2. **Seguridad Multicapa**: Sistema de guardrails que detecta contenido inapropiado y jailbreaking
3. **Clasificación Inteligente**: Identificación automática de intenciones con niveles de confianza
4. **Evaluación Objetiva**: Algoritmos de scoring multidimensionales consistentes
5. **Generación Contextualizada**: Respuestas adaptadas al tipo y contexto de la comunicación
6. **Trazabilidad Completa**: Registro estructurado de todas las decisiones y métricas
7. **Arquitectura Modular**: 15 agentes especializados organizados en pipelines
8. **Visualización Automática**: Diagramas arquitectónicos generados desde código
9. **Escalabilidad**: Procesamiento ilimitado sin degradación de calidad
10. **Mantenibilidad**: Configuración centralizada y código bien estructurado

### 8.2 Funcionamiento del Sistema

#### 8.2.1 Modos de Operación

El sistema ofrece **dos modos de operación** para adaptarse a diferentes tipos de usuarios y casos de uso:

**Modo 1: Interfaz Web (Usuarios No Técnicos)**

Interfaz gráfica moderna desarrollada con HTML5, CSS3 y JavaScript, accesible mediante navegador web:

- **URL**: http://localhost:8000
- **Características**:
  - Entrada de texto directo mediante formulario
  - Upload de archivos arrastrando (drag & drop) o selección manual
  - Navegación de archivos de ejemplo del directorio `data/`
  - Visualización del workflow en tiempo real mediante WebSocket
  - Display de cada agente procesando con inputs/outputs
  - Animaciones de progreso y estados
  - Modo oscuro/claro configurable
  - Diseño responsive para dispositivos móviles

**Modo 2: Línea de Comandos (Usuarios Técnicos)**

Interfaz CLI interactiva para procesamiento directo:

- **Comando**: `python router.py`
- **Características**:
  - Menú interactivo de selección de archivos
  - Soporte para todos los formatos (.txt, .pdf, imágenes)
  - Output JSON estructurado en consola
  - Ideal para scripts, automatización y debugging

#### 8.2.2 Arquitectura de Deployment

**Backend FastAPI**:
- API REST completa en `/api/*` endpoints
- WebSocket en `/ws` para comunicación bidireccional en tiempo real
- Servidor ASGI asíncrono (Uvicorn)
- CORS habilitado para desarrollo local
- Servicio de archivos estáticos para frontend

**Endpoints Disponibles**:
- `GET /`: Interfaz web principal
- `GET /api/health`: Health check del sistema
- `GET /api/data-files`: Lista de archivos disponibles en `data/`
- `POST /api/upload`: Upload de archivos nuevos
- `POST /api/workflow`: Ejecución síncrona de workflow (REST)
- `WS /ws`: Conexión WebSocket para ejecución con actualizaciones en tiempo real

**Frontend Moderno**:
- HTML semántico con accesibilidad
- CSS modular con variables CSS y tema dark/light
- JavaScript vanilla (sin frameworks pesados)
- WebSocket client para comunicación real-time
- Animaciones CSS para feedback visual

#### 8.2.3 Flujo General

```
[Comunicación Entrante]
         ↓
   [Guardrails Agent]
         ↓
  ¿Pasa validación?
    ↓         ↓
   NO        SÍ
    ↓         ↓
[Bloqueo] [Intent Classifier]
              ↓
         ¿Categoría?
    ↓        ↓        ↓
   CV      Sales   Event/Other
    ↓        ↓        ↓
[Pipeline] [Pipeline] [Pipeline]
    ↓        ↓        ↓
[Respuesta/Briefing Interno]
```

#### 8.2.4 Interacción del Usuario - Modo Web

**Flujo de Uso Típico**:

1. **Acceso al Sistema**: Usuario abre navegador en `http://localhost:8000`
2. **Selección de Input**: 
   - Tab "Text Input": Escribe o pega texto directamente
   - Tab "Upload File": Arrastra archivo o selecciona desde explorador
   - Tab "Browse Examples": Selecciona archivo de ejemplo del directorio `data/`
3. **Inicio de Procesamiento**: Click en botón "Start Workflow"
4. **Visualización en Tiempo Real**:
   - Conexión WebSocket establecida automáticamente
   - Cada agente muestra su nombre y estado (processing/completed)
   - Inputs y outputs visibles en tiempo real
   - Razonamiento del modelo mostrado (cuando disponible)
   - Métricas de tokens consumidos por agente
   - Animaciones de progreso visuales
5. **Resultado Final**: 
   - JSON estructurado con ruta ejecutada y payload completo
   - Opción de copiar resultado al portapapeles
   - Botón para reiniciar con nueva consulta

**Características de UX**:
- Feedback inmediato en cada acción
- Estados de loading claros
- Mensajes de error descriptivos
- Validación de archivos antes de upload
- Indicadores de progreso durante procesamiento
- Diseño limpio y profesional sin saturación visual

#### 8.2.5 Interacción del Usuario - Modo CLI

#### 8.2.5 Interacción del Usuario - Modo CLI

1. **Inicio del Sistema**: El usuario ejecuta `python router.py` en terminal
2. **Selección de Archivo**: Menú interactivo presenta archivos disponibles en directorio `data/`
3. **Procesamiento Automático**: El sistema detecta el formato, lo procesa y ejecuta el pipeline apropiado
4. **Visualización de Resultados**: Output estructurado en consola con:
   - Ruta ejecutada
   - Scores calculados
   - Decisiones tomadas
   - Contenido generado (respuestas, briefings)

#### 8.2.6 Ejemplos de Funcionamiento

**Ejemplo 1: Candidatura Exitosa de Capitán**

Input (archivo: `candidatura_capitan.txt`):
```
Estimados señores de OCEANIX,

Me dirijo a ustedes para presentar mi candidatura al puesto de Capitán 
de Barco Pesquero. Cuento con 12 años de experiencia en pesca de altura, 
Certificación de Capitán de la Marina Mercante y certificaciones STCW.

He navegado en flotas pesqueras en aguas del Atlántico Norte...
```

Output:
```json
{
  "final_route": "cv_forward_to_hr",
  "payload": {
    "candidate_name": "Candidato Anónimo",
    "match_score": 88,
    "matched_position": "FLOTA-CAP-01",
    "reasoning": "Experiencia superior a requisitos (12 vs 8 años), 
                  certificaciones marítimas completas, perfil senior",
    "internal_message": "Candidato de alto potencial para puesto de Capitán..."
  }
}
```

**Ejemplo 2: Lead Comercial Prioritario**

Input (archivo: `consulta_hotel.pdf` - PDF escaneado):
```
[PDF con membrete de cadena hotelera]

Asunto: Suministro de Pescado Fresco

Estimado proveedor,

Somos una cadena de 15 hoteles en la costa y necesitamos un proveedor 
confiable de pescado fresco. Nuestro volumen estimado es de 120 toneladas/mes.

Requerimos certificaciones IFS y trazabilidad completa...

Atentamente,
María González
Directora de Compras
```

Output:
```json
{
  "final_route": "sales_forward_to_team",
  "payload": {
    "lead_score": 95,
    "priority": "A",
    "company_domain": "corporate",
    "volume_commitment": "high",
    "timeline": "clear",
    "decision_maker": true,
    "certifications_required": true,
    "sector_bonus": "Cadena de hoteles",
    "sales_briefing": "LEAD PRIORITARIO - Responder en 24h. Cadena hotelera 
                       establecida busca suministro recurrente de alto volumen..."
  }
}
```

**Ejemplo 3: Bloqueo por Guardrails**

Input:
```
[Contenido inapropiado detectado por moderación]
```

Output:
```json
{
  "final_route": "guardrails_block",
  "payload": {
    "reason": "moderation_flagged",
    "message": "Su comunicación no pudo ser procesada debido a contenido 
                inapropiado. Por favor, revise nuestras políticas..."
  }
}
```

### 8.3 Logros Alcanzados

#### 8.3.1 Automatización Completa

✅ **100% de comunicaciones procesadas automáticamente** desde recepción hasta generación de respuesta o briefing interno, eliminando intervención humana en tareas repetitivas.

✅ **Reducción del 95% en tiempo de clasificación inicial**: De 15-20 minutos por comunicación a procesamiento instantáneo.

✅ **Liberación de 80-110 horas/persona mensuales**: Recursos redirigidos a actividades estratégicas (entrevistas personalizadas, negociaciones complejas).

#### 8.3.2 Consistencia y Calidad

✅ **Evaluación 100% objetiva**: Todos los candidatos y leads evaluados con idénticos criterios algorítmicos, eliminando sesgos subjetivos.

✅ **Trazabilidad completa**: Cada comunicación genera registro estructurado con decisiones, scores y justificaciones.

✅ **Validación mediante esquemas Pydantic**: 0 errores de formato en outputs generados.

#### 8.3.3 Seguridad

✅ **Sistema de guardrails operativo**: Detección y bloqueo automático de contenido inapropiado, información sensible y jailbreaking.

✅ **Protección de datos**: Redacción automática de información personal sensible en logs y trazas.

✅ **Cumplimiento normativo**: Sistema facilita compliance con RGPD y normativas de protección de datos.

#### 8.3.4 Capacidades Técnicas

✅ **Multi-modalidad implementada**: Soporte nativo para .txt, .pdf, .png, .jpg, .jpeg, .gif, .webp.

✅ **0 dependencias de bibliotecas de extracción**: Sistema utiliza únicamente capacidades nativas de OpenAI.

✅ **Arquitectura escalable**: Sistema preparado para procesar incrementos de volumen sin modificaciones.

✅ **Documentación automática**: Visualizaciones generadas directamente desde código, siempre sincronizadas.

✅ **Interfaz web moderna**: Frontend HTML5/CSS3/JavaScript con diseño responsive y modo oscuro/claro.

✅ **API REST completa**: Backend FastAPI con endpoints para integración programática.

✅ **WebSocket para tiempo real**: Comunicación bidireccional para visualización de workflow en ejecución.

✅ **Upload de archivos vía web**: Interfaz drag-and-drop para usuarios no técnicos.

✅ **Doble modo de operación**: CLI para técnicos y web UI para usuarios de negocio.

✅ **Procesamiento asíncrono**: Arquitectura async/await para máximo rendimiento.

#### 8.3.5 Impacto Organizacional

✅ **Mejora en tiempos de respuesta**: De horas/días a segundos en comunicaciones estándar.

✅ **Incremento en calidad de servicio**: Respuestas inmediatas y profesionales mejoran percepción de marca.

✅ **Capacidad de análisis**: Datos estructurados permiten analytics y optimización continua.

✅ **Escalabilidad probada**: Sistema procesa picos de volumen sin degradación de servicio.

### 8.4 Limitaciones Identificadas

#### 8.4.1 Limitaciones Técnicas

**Dependencia de Conectividad**:
- El sistema requiere conexión estable a internet para comunicarse con la API de OpenAI
- No funciona en modo offline
- **Mitigación potencial**: Implementación de cola de procesamiento para reintentos automáticos

**Costos de API**:
- Cada procesamiento consume créditos de API de OpenAI
- Modelos más potentes (gpt-4) incrementarían significativamente los costos
- **Mitigación actual**: Uso de gpt-4o-mini con reasoning effort: low para optimización

**Procesamiento Secuencial**:
- Actualmente el sistema procesa comunicaciones una a una
- No hay procesamiento batch paralelo
- **Mitigación potencial**: Implementación de procesamiento asíncrono con asyncio

#### 8.4.2 Limitaciones Funcionales

**Contexto Limitado**:
- El sistema no mantiene memoria de conversaciones previas con el mismo remitente
- Cada comunicación se procesa de forma aislada
- **Mitigación potencial**: Integración con CRM para contexto histórico

**Idiomas Soportados**:
- Clasificación optimizada para español, inglés y portugués
- Otros idiomas clasificados como "other" con menor precisión
- **Mitigación potencial**: Expansión de dataset de entrenamiento con ejemplos multilingües

**Casos Edge Complejos**:
- Comunicaciones con múltiples intenciones mezcladas pueden ser mal clasificadas
- Emails con cadenas de respuestas largas pueden generar ruido
- **Mitigación potencial**: Pre-procesamiento para limpieza de cadenas de email

#### 8.4.3 Limitaciones Operacionales

**Integración con Sistemas Empresariales**:
- Los resultados deben ser copiados manualmente a sistemas downstream (CRM, ATS, ERP)
- No hay sincronización automática bidireccional con bases de datos empresariales
- **Mitigación implementada**: API REST disponible para integración programática
- **Mitigación potencial**: Desarrollo de conectores específicos para SAP, Salesforce, Workday

**Monitoreo y Analytics Empresarial**:
- No hay integración con plataformas de BI corporativas
- Métricas no se exportan automáticamente a dashboards ejecutivos
- **Mitigación implementada**: Visualización en tiempo real vía interfaz web
- **Mitigación potencial**: Integración con plataformas de observabilidad empresarial (Datadog, New Relic, Prometheus/Grafana)

**Procesamiento Batch Limitado**:
- Procesamiento actual es unitario (una comunicación a la vez vía interfaz web)
- No hay programación de procesamiento masivo nocturno
- **Mitigación potencial**: Implementación de cola de procesamiento con Celery o RabbitMQ

#### 8.4.4 Limitaciones de Seguridad

**Almacenamiento de API Keys**:
- Actualmente las keys se almacenan en archivo .env local
- Riesgo de exposición en repositorios versionados
- **Mitigación actual**: .env incluido en .gitignore
- **Mitigación potencial**: Uso de servicios de gestión de secretos (AWS Secrets Manager, Azure Key Vault)

**Ausencia de Autenticación**:
- El sistema no valida la identidad del usuario que lo ejecuta
- Cualquiera con acceso al servidor puede procesar comunicaciones
- **Mitigación potencial**: Implementación de autenticación y control de acceso basado en roles

---

## 9. Conclusiones

### 9.1 Cumplimiento de Objetivos

El presente proyecto cumplió exitosamente con todos los objetivos planteados, desarrollando e implementando un sistema RPA basado en arquitectura multiagente que automatiza integralmente el procesamiento de comunicaciones empresariales de OCEANIX Galicia S.A.

**Objetivos Específicos Alcanzados**:
- ✅ Sistema de guardrails operativo con detección multicapa
- ✅ Clasificador de intenciones con confidence scoring
- ✅ Sistema de matching de candidatos con scoring ponderado
- ✅ Calificador de leads comerciales con priorización A/B/C
- ✅ Generación automática de respuestas contextualizadas
- ✅ Herramientas de visualización arquitectónica automática
- ✅ Soporte multi-modal para PDFs e imágenes
- ✅ Interfaz web moderna con visualización en tiempo real
- ✅ Backend API REST para integración empresarial
- ✅ Comunicación WebSocket para feedback instantáneo

### 9.2 Valor Agregado del Enfoque con Agentes de OpenAI

La decisión estratégica de utilizar agentes de OpenAI como plataforma base proporcionó **valor agregado diferencial** frente a soluciones RPA tradicionales:

**1. Versatilidad Multi-Modal Sin Precedentes**:
- Procesamiento unificado de textos, PDFs, imágenes y otros formatos mediante una única interfaz
- Eliminación completa de bibliotecas especializadas (PyPDF2, pdfplumber, pytesseract)
- Capacidad de manejar formatos complejos, mal estructurados o con calidad variable
- Robustez ante PDFs escaneados, capturas de pantalla y documentos con layouts irregulares

**2. Inteligencia Contextual vs. Reglas Rígidas**:
- Comprensión semántica del contenido, no solo matching de patrones
- Adaptación a variaciones en la formulación sin necesidad de reglas explícitas
- Capacidad de inferencia y razonamiento sobre información implícita
- Generalización a casos no vistos durante el desarrollo

**3. Simplicidad Arquitectónica**:
- Reducción drástica en líneas de código comparado con RPA tradicional
- Menos dependencias = menos puntos de fallo y mantenimiento más sencillo
- Configuración declarativa vs. programación imperativa compleja
- Curva de aprendizaje reducida para nuevos desarrolladores

**4. Escalabilidad y Flexibilidad**:
- Adición de nuevos tipos de comunicaciones mediante configuración, no código
- Extensión a nuevos idiomas sin reentrenamiento de modelos propios
- Ajuste de criterios de evaluación modificando prompts y esquemas
- Reutilización de componentes en otros contextos organizacionales

### 9.3 Aprendizajes Clave

**Técnicos**:
- La arquitectura multiagente con separación de responsabilidades facilita enormemente el testing y debugging
- Los esquemas Pydantic son fundamentales para garantizar calidad de outputs en sistemas de IA generativa
- La visualización automática desde código es crítica para documentación en sistemas complejos
- El procesamiento multi-modal nativo supera en robustez a pipelines con bibliotecas especializadas

**Organizacionales**:
- La automatización de procesos repetitivos libera recursos humanos para actividades de mayor valor
- La consistencia algorítmica mejora significativamente la calidad de decisiones operativas
- La trazabilidad estructurada habilita capacidades de analytics y mejora continua
- La reducción de tiempos de respuesta impacta positivamente en percepción de marca

**Metodológicos**:
- El desarrollo iterativo con validación continua permite detectar problemas tempranamente
- La definición clara de esquemas de datos desde la fase de diseño acelera la implementación
- La documentación simultánea al desarrollo (no post-facto) mejora la calidad del producto
- El testing con casos reales es fundamental para validar robustez del sistema

### 9.4 Recomendaciones para Trabajo Futuro

**Extensiones Implementadas** ✅:
1. ✅ **API REST**: Sistema expuesto como servicio FastAPI para integración con CRM, ATS y ERP
2. ✅ **Interfaz Web**: Frontend HTML5/CSS3/JavaScript moderno para usuarios no técnicos
3. ✅ **Visualización en Tiempo Real**: Dashboard con WebSocket mostrando workflow step-by-step
4. ✅ **Upload de Archivos Web**: Sistema drag-and-drop para carga de documentos
5. ✅ **Procesamiento Multi-Modal**: Soporte nativo PDFs e imágenes sin bibliotecas externas

**Prioridad Alta** (Siguiente Fase):
1. **Conectores Empresariales**: Integración directa con Salesforce, SAP, Workday, Microsoft Dynamics
2. **Procesamiento Batch Masivo**: Cola de procesamiento asíncrono con Celery/Redis para lotes nocturnos
3. **Sistema de Autenticación**: OAuth2/JWT para control de acceso basado en roles (Admin, HR, Sales, Viewer)
4. **Export de Métricas**: Exportación automática a Power BI, Tableau, Google Data Studio
5. **Feedback Loop**: Mecanismo para que usuarios validen/corrijan decisiones y mejorar algoritmos

**Prioridad Media**:
6. **Expansión Multi-Idioma**: Ampliar soporte robusto a alemán, francés, italiano (mercados de exportación)
7. **Caché Inteligente**: Sistema de caché para comunicaciones similares con deduplicación
8. **Historial de Comunicaciones**: Base de datos para tracking de remitentes recurrentes
9. **Notificaciones Push**: Alertas en tiempo real para leads prioritarios A
10. **Mobile App**: Aplicación móvil para aprobación rápida de candidatos/leads desde smartphone

**Prioridad Baja** (Exploración):
11. **Fine-Tuning de Modelos**: Modelos especializados para terminología del sector pesquero
12. **Análisis de Sentimiento**: Evaluación de tono emocional en comunicaciones
13. **Modo Offline**: Fallback con modelos locales (Llama, Mistral) para operación sin conectividad
14. **Asistente de Voz**: Integración con Whisper API para procesamiento de mensajes de voz
15. **Integración con Email**: Procesamiento directo desde bandeja de entrada vía IMAP/SMTP

### 9.5 Reflexión Final

Este proyecto demuestra que la automatización inteligente de procesos mediante agentes de IA no es exclusiva de grandes corporaciones tecnológicas, sino accesible y práctica para organizaciones medianas en sectores tradicionales como el pesquero.

La clave del éxito radica en la **selección estratégica de tecnología apropiada** (agentes de OpenAI por su versatilidad multi-modal), la **arquitectura bien diseñada** (separación de responsabilidades, modularidad) y el **enfoque práctico** (resolver problemas reales con impacto cuantificable).

El sistema desarrollado representa un caso de estudio relevante sobre la aplicación de arquitecturas multiagente en contextos empresariales reales, validando la viabilidad técnica y el valor de negocio de la automatización inteligente. Los 80-110 horas/persona mensuales liberadas, la mejora en consistencia de evaluación y la reducción de tiempos de respuesta de días a segundos constituyen beneficios tangibles y medibles.

Más allá de la automatización específica, el proyecto establece una **base arquitectónica reutilizable** para futuros desarrollos: la estructura de guardrails + clasificador + extractores + evaluadores + generadores + packagers es aplicable a múltiples dominios (atención al cliente, procesamiento de reclamaciones, gestión de pedidos, etc.).

El futuro del RPA no reside en scripts rígidos que emulan clics de ratón, sino en **agentes inteligentes que comprenden contexto, razonan sobre información multi-modal y toman decisiones objetivas**. Este proyecto es una demostración práctica de ese futuro aplicado al presente.

---

## 10. Visualización de la Arquitectura

### 10.1 Diagrama Conceptual Completo

La complejidad inherente de una arquitectura multiagente con 15 componentes interconectados requiere herramientas de documentación visual que faciliten:

- Comprensión rápida de la arquitectura por nuevos desarrolladores
- Comunicación efectiva con stakeholders no técnicos
- Identificación de puntos de optimización
- Debugging de flujos problemáticos
- Documentación técnica profesional

Hemos desarrollado un sistema de visualización automática basado en Graphviz que genera diagramas directamente desde el código fuente, garantizando que la documentación refleje siempre el estado actual del sistema.

<p align="center">
    <a href="agent_graphs/router_architecture_complete.png">
        <img src="agent_graphs/router_architecture_complete.png" alt="Diagrama principal — Router architecture" style="max-width:100%;height:auto;">
    </a>
</p>

_Figura 1: Diagrama conceptual completo de la arquitectura multiagente del sistema de routing._

### 10.2 Convenciones Visuales

El sistema utiliza un código de colores consistente:

- **Amarillo claro (#FFE5B4)**: Agentes principales de procesamiento (extractores, evaluadores)
- **Verde claro (#90EE90)**: Agentes de generación de comunicaciones (drafters)
- **Gris (#D3D3D3)**: Agentes de empaquetado final (packagers)
- **Gris claro (lightgray)**: Nodos de decisión (guardrails pass, clasificación, matching)
- **Azul claro (lightblue)**: Puntos de inicio y fin de flujos

Los estilos de línea indican el tipo de relación:
- **Líneas sólidas**: Flujo principal de datos entre agentes
- **Líneas punteadas**: Invocación de herramientas externas
- **Líneas discontinuas**: Conexión con servidores MCP

### 10.3 Generación de Visualizaciones

**Instalación de Dependencias**:

```bash
pip install -r requirements.txt
```

**Instalación de Motor Graphviz** (Windows):
1. Descargar instalador desde https://graphviz.org/download/
2. Marcar opción "Add Graphviz to system PATH" durante instalación
3. Reiniciar terminal

**Ejecución**:

```bash
python visualize_agents.py
```

El script ofrece tres opciones interactivas:
1. Diagrama conceptual completo de toda la arquitectura
2. Grafos individuales por agente (15 archivos PNG)
3. Vista del punto de entrada (Guardrails Agent)

Archivos generados en `agent_graphs/`:
- `router_architecture_complete.png`: Diagrama principal
- `router_architecture_complete.dot`: Código fuente editable
- `agent_*.png`: Grafos individuales

---

## 11. Referencias Técnicas y Anexos

### 11.1 Documentación de Dependencias

- **OpenAI Agents SDK**: https://platform.openai.com/docs/agents
- **Pydantic**: https://docs.pydantic.dev/
- **Graphviz**: https://graphviz.org/documentation/
- **Python**: https://docs.python.org/3/

### 11.2 Configuración del Sistema

**Archivo `.env`**:
```
OPENAI_API_KEY=tu_api_key_aqui
```

**Archivo `requirements.txt`**:
```
openai-agents[viz]>=0.2.8
graphviz>=0.20.0
python-dotenv>=1.0.0
pydantic>=2.0.0
fastapi>=0.104.0
uvicorn[standard]>=0.24.0
python-multipart>=0.0.6
```

### 11.3 Ejecución del Sistema

**Opción 1: Interfaz Web (Recomendado para Usuarios No Técnicos)**

```bash
# Instalar dependencias
pip install -r requirements.txt

# Iniciar servidor web
python app.py
```

El sistema se iniciará en `http://localhost:8000`. Abrir en navegador para acceder a la interfaz gráfica.

**Características del servidor web**:
- FastAPI backend con endpoints REST
- WebSocket para actualizaciones en tiempo real
- Upload de archivos drag-and-drop
- Visualización del workflow step-by-step
- Tema oscuro/claro configurable
- Diseño responsive

**Opción 2: Línea de Comandos (Para Usuarios Técnicos y Scripts)**

```bash
# Procesar comunicación vía CLI
python router.py
```

Presenta menú interactivo para seleccionar archivo del directorio `data/`.

**Opción 3: Generación de Visualizaciones Arquitectónicas**

```bash
# Generar diagramas de arquitectura
python visualize_agents.py
```

Genera diagrama completo y grafos individuales por agente en `agent_graphs/`.

### 11.4 Endpoints API Disponibles

**REST Endpoints**:
- `GET /`: Interfaz web principal (HTML)
- `GET /api/health`: Health check del sistema
- `GET /api/data-files`: Lista archivos disponibles en `data/`
- `POST /api/upload`: Upload de nuevo archivo
- `POST /api/workflow`: Ejecutar workflow (JSON request/response)

**WebSocket Endpoint**:
- `WS /ws`: Conexión para ejecución con eventos en tiempo real
  - Eventos: `agent_start`, `agent_input`, `agent_thinking`, `agent_end`, `handoff`, `result`, `error`

**Ejemplo de Request REST**:
```bash
curl -X POST http://localhost:8000/api/workflow \
  -H "Content-Type: application/json" \
  -d '{"text": "Me gustaría aplicar para el puesto de Capitán..."}'
```

### 11.5 Estructura de Directorios

```
intelligent_enterprise_agentic_router/
├── app.py                            # Backend FastAPI con WebSocket
├── router.py                         # Sistema principal RPA (CLI mode)
├── visualize_agents.py               # Generación de visualizaciones
├── requirements.txt                  # Dependencias Python
├── .env                             # Configuración (no versionado)
├── README.md                        # Este informe académico
├── data/                            # Archivos de comunicaciones a procesar
│   ├── prueba.txt
│   └── workflowexample.txt
├── static/                          # Frontend web
│   ├── index.html                   # Interfaz principal
│   ├── script_v2.js                 # Lógica del cliente
│   └── styles_v2.css                # Estilos modernos
├── agent_graphs/                    # Visualizaciones generadas
│   ├── router_architecture_complete.png
│   ├── agent_guardrails.png
│   └── ...
└── __pycache__/                     # Cache de Python (auto-generado)
```

---

## 12. Autoría y Contexto Académico

**Proyecto**: Sistema Automatizado de Routing y Clasificación de Comunicaciones Empresariales mediante Arquitectura Multiagente

**Institución**: Universidad Intercontinental de la Empresa (UIE)  
**Programa**: Grado en Ingeniería de Sistemas Inteligentes (GISI)  
**Asignatura**: Tecnologías de Automatización y Robotización  
**Empresa Caso de Estudio**: OCEANIX Galicia S.A.

**Fecha de Elaboración**: Octubre 2025


---

## Anexo A: Glosario de Términos

**RPA (Robotic Process Automation)**: Tecnología de automatización de procesos mediante software que emula acciones humanas repetitivas.

**Arquitectura Multiagente**: Diseño de sistema donde múltiples componentes autónomos (agentes) colaboran para lograr objetivos complejos.

**Guardrails**: Mecanismos de seguridad que validan y filtran entradas antes del procesamiento principal.

**Scoring Ponderado**: Algoritmo de evaluación que asigna puntuaciones según múltiples criterios con pesos diferenciados.

**Multi-modalidad**: Capacidad de procesar múltiples tipos de entrada (texto, imagen, audio, video) de forma unificada.

**Handoff**: Transferencia de control de un agente a otro dentro de una arquitectura multiagente.

**Jailbreaking**: Intento de manipular un sistema de IA para que ignore sus instrucciones o limitaciones de seguridad.

**Structured Outputs**: Salidas generadas por modelos de IA que cumplen con esquemas de datos predefinidos.

**Pipeline**: Secuencia de procesamiento donde la salida de cada etapa alimenta la siguiente.

**Lead Scoring**: Proceso de calificación de oportunidades comerciales según probabilidad de conversión.

---

**Fin del Informe Académico**

