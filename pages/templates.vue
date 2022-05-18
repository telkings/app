<template>
  <div class="col-12">
    <!-- WIDGET CONFIGURATOR -->
    <div class="row">
      <card>
        <div slot="header">
          <h4 class="card-title">TIPO DE DISPOSITIVO</h4>
        </div>

        <div class="row">
          <!-- WIDGET SELECTOR AND FORMS -->
          <div class="col-12">
            <!-- WIDGETS SELECTOR -->
            <el-select
              v-model="widgetType"
              class="select-primary"
              placeholder="Seleccione el tipo de dispositivo"
              style="width: 100%;"
            >
              <el-option
                class="text-dark"
                value="numberchart"
                label="Graficador"
              >
              </el-option>
              <!--
              <el-option
                class="text-dark"
                value="map"
                label="Mapa"
              ></el-option>
              -->
              <el-option
                class="text-dark"
                value="switch"
                label="Botón ON/OFF"
              ></el-option>
              <!-- <el-option
                class="text-dark"
                value="lastconect"
                label="Última conexión Widget"
              >
              </el-option>
              <el-option
                class="text-dark"
                value="label"
                label="Label INPUT <-"
              ></el-option>
              <el-option
                class="text-dark"
                value="rtinfo"
                label="RT Info INPUT <-"
              ></el-option> -->
              <el-option
                class="text-dark"
                value="mapa"
                label="Mapa"
              ></el-option>

              <el-option
                class="text-dark"
                value="tracking"
                label="Mapa Tracking"
              ></el-option>
            </el-select>

            <br />
            <br />

            <!-- FORMS NUMBER CHART TYPE -->
            <div v-if="widgetType == 'numberchart'">
              <base-input
                v-model="ncConfig.variableFullName"
                label="Variable - Ej: temperatura, humedad"
                type="text"
              >
              </base-input>

              <base-input
                v-model="ncConfig.unit"
                label="Unidad de medida - Ej: Lts, %, V, °C"
                type="text"
              >
              </base-input>

              <base-input
                v-model.number="ncConfig.decimalPlaces"
                label="Decimales - precisión de medida"
                type="number"
              >
              </base-input>

              <base-input
                v-model="ncConfig.icon"
                label="Icon"
                type="text"
              ></base-input>

              <br />

              <base-input
                v-model.number="ncConfig.variableSendFreq"
                label="Frecuencia de recepción de datos - seg"
                type="number"
              ></base-input>

              <br />

              <base-input
                v-model.number="ncConfig.chartTimeAgo"
                label="Indique el tiempo para graficar datos (mins)"
                type="number"
              ></base-input>

              <br />

              <el-select
                v-model="ncConfig.class"
                class="select-primary"
                placeholder="Select Class"
                style="width: 100%;"
              >
                <el-option
                  class="text-dark"
                  value="success"
                  label="verde"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="primary"
                  label="azul"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="warning"
                  label="naranja"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="danger"
                  label="amarillo"
                ></el-option>
              </el-select>

              <br /><br /><br />

              <el-select
                v-model="ncConfig.column"
                class="select-primary"
                placeholder="Select Column Width"
                style="width: 100%;"
              >
                <!--
                <el-option
                  class="text-dark"
                  value="col-3"
                  label="col-3"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-4"
                  label="col-4"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-5"
                  label="col-5"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-6"
                 label="Display pequeño"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-7"
                  label="col-7"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-8"
                  label="col-8"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-9"
                  label="col-9"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-10"
                  label="col-10"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-11"
                  label="col-11"
                ></el-option>
                -->
                <el-option
                  class="text-dark"
                  value="col-12"
                  label="Display grande"
                ></el-option>
              </el-select>

              <br /><br />
            </div>

            <!-- FORM SWITCH TYPE -->
            <div v-if="widgetType == 'switch'">
              <base-input
                v-model="iotSwitchConfig.variableFullName"
                label="Variable"
                type="text"
              >
              </base-input>

              <base-input
                v-model="iotSwitchConfig.icon"
                label="Icon"
                type="text"
              ></base-input>

              <br />

              <el-select
                v-model="iotSwitchConfig.class"
                class="select-primary"
                placeholder="Select Class"
                style="width: 100%;"
              >
                <el-option
                  class="text-dark"
                  value="success"
                  label="verde"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="primary"
                  label="azul"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="warning"
                  label="naranja"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="danger"
                  label="amarillo"
                ></el-option>
              </el-select>

              <br /><br /><br />

              <el-select
                v-model="iotSwitchConfig.column"
                class="select-primary"
                placeholder="Select Column Width"
                style="width: 100%;"
              >
                <!--
                <el-option
                  class="text-dark"
                  value="col-3"
                  label="col-3"
                ></el-option> 
                <el-option
                  class="text-dark"
                  value="col-4"
                  label="col-4"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-5"
                  label="col-5"
                ></el-option>
                -->
                <el-option
                  class="text-dark"
                  value="col-6"
                  label="Display pequeño"
                ></el-option>
                <!--
                <el-option
                  class="text-dark"
                  value="col-7"
                  label="col-7"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-8"
                  label="col-8"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-9"
                  label="col-9"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-10"
                  label="col-10"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-11"
                  label="col-11"
                ></el-option>
                -->
                <el-option
                  class="text-dark"
                  value="col-12"
                  label="Display grande"
                ></el-option>
              </el-select>

              <br /><br />
            </div>

            <!-- FORM BUTTON TYPE -->
            <div v-if="widgetType == 'button'">
              <base-input
                v-model="configButton.variableFullName"
                label="Variable"
                type="text"
              >
              </base-input>

              <base-input
                v-model="configButton.message"
                label="Mensaje a enviar"
                type="text"
              >
              </base-input>

              <base-input
                v-model="configButton.text"
                label="Ingrese el texto a mostrar en el botón"
                type="text"
              >
              </base-input>

              <base-input
                v-model="configButton.icon"
                label="Icon"
                type="text"
              ></base-input>

              <br />

              <el-select
                v-model="configButton.class"
                class="select-primary"
                placeholder="Select Class"
                style="width: 100%;"
              >
                <el-option
                  class="text-dark"
                  value="success"
                  label="verde"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="primary"
                  label="azul"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="warning"
                  label="naranja"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="danger"
                  label="amarillo"
                ></el-option>
              </el-select>

              <br /><br /><br />

              <el-select
                v-model="configButton.column"
                class="select-primary"
                placeholder="Select Column Width"
                style="width: 100%;"
              >
                <!--
                <el-option
                  class="text-dark"
                  value="col-3"
                  label="col-3"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-4"
                  label="col-4"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-5"
                  label="col-5"
                ></el-option>
                -->
                <el-option
                  class="text-dark"
                  value="col-6"
                  label="Display pequeño"
                ></el-option>
                <!--
                <el-option
                  class="text-dark"
                  value="col-7"
                  label="col-7"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-8"
                  label="col-8"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-9"
                  label="col-9"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-10"
                  label="col-10"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-11"
                  label="col-11"
                ></el-option>
                -->
                <el-option
                  class="text-dark"
                  value="col-12"
                  label="Display grande"
                ></el-option>
              </el-select>

              <br /><br />
            </div>

            <!-- FORM INDICATOR TYPE -->
            <div v-if="widgetType == 'indicator'">
              <base-input
                v-model="iotIndicatorConfig.variableFullName"
                label="Variable"
                type="text"
              >
              </base-input>

              <base-input
                v-model="iotIndicatorConfig.icon"
                label="Icon"
                type="text"
              ></base-input>

              <br />

              <base-input
                v-model="iotIndicatorConfig.variableSendFreq"
                label="Frecuencia de recepción de datos - seg"
                type="text"
              ></base-input>

              <br />

              <el-select
                v-model="iotIndicatorConfig.class"
                class="select-primary"
                placeholder="Select Class"
                style="width: 100%;"
              >
                <el-option
                  class="text-dark"
                  value="success"
                  label="verde"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="primary"
                  label="azul"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="warning"
                  label="naranja"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="danger"
                  label="amarillo"
                ></el-option>
              </el-select>

              <br /><br /><br />

              <el-select
                v-model="iotIndicatorConfig.column"
                class="select-primary"
                placeholder="Select Column Width"
                style="width: 100%;"
              >
                <!--
                <el-option
                  class="text-dark"
                  value="col-3"
                  label="col-3"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-4"
                  label="col-4"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-5"
                  label="col-5"
                ></el-option>
                -->
                <el-option
                  class="text-dark"
                  value="col-6"
                  label="Display pequeño"
                ></el-option>
                <!--
                <el-option
                  class="text-dark"
                  value="col-7"
                  label="col-7"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-8"
                  label="col-8"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-9"
                  label="col-9"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-10"
                  label="col-10"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-11"
                  label="col-11"
                ></el-option>
                -->
                <el-option
                  class="text-dark"
                  value="col-12"
                  label="Display grande"
                ></el-option>
              </el-select>

              <br /><br />
            </div>

            <!-- FORM LASTCONEXION TYPE -->
            <div v-if="widgetType == 'lastconect'">
              <base-input
                v-model="iotLastconectConfig.variableFullName"
                label="Var Name"
                type="text"
              >
              </base-input>

              <base-input
                v-model="iotLastconectConfig.icon"
                label="Icon"
                type="text"
              ></base-input>

              <br />

              <base-input
                v-model="iotLastconectConfig.variableSendFreq"
                label="Send Freq"
                type="text"
              ></base-input>

              <br />

              <el-select
                v-model="iotLastconectConfig.class"
                class="select-primary"
                placeholder="Select Class"
                style="width: 100%;"
              >
                <el-option
                  class="text-success"
                  value="success"
                  label="verde"
                ></el-option>
                <el-option
                  class="text-primary"
                  value="primary"
                  label="azul"
                ></el-option>
                <el-option
                  class="text-warning"
                  value="warning"
                  label="naranja"
                ></el-option>
                <el-option
                  class="text-danger"
                  value="danger"
                  label="amarillo"
                ></el-option>
              </el-select>

              <br /><br /><br />

              <el-select
                v-model="iotLastconectConfig.column"
                class="select-success"
                placeholder="Select Column Width"
                style="width: 100%;"
              >
                <el-option
                  class="text-dark"
                  value="col-lg-3"
                  label="small size"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-lg-4"
                  label="4 size"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-lg-5"
                  label="5 size"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-lg-6"
                  label="medium size"
                ></el-option>
              </el-select>

              <br /><br />
            </div>

            <!-- FORM LABEL TYPE -->
            <div v-if="widgetType == 'label'">
              <base-input
                v-model="iotLabelConfig.variableFullName"
                label="Var Name"
                type="text"
              >
              </base-input>

              <base-input
                v-model="iotLabelConfig.icon"
                label="Icon"
                type="text"
              ></base-input>

              <br />

              <base-input
                v-model="iotLabelConfig.variableSendFreq"
                label="Send Freq"
                type="text"
              ></base-input>

              <br />

              <el-select
                v-model="iotLabelConfig.class"
                class="select-success"
                placeholder="Select Class"
                style="width: 100%;"
              >
                <el-option
                  class="text-success"
                  value="success"
                  label="verde"
                ></el-option>
                <el-option
                  class="text-primary"
                  value="primary"
                  label="azul"
                ></el-option>
                <el-option
                  class="text-warning"
                  value="warning"
                  label="naranja"
                ></el-option>
                <el-option
                  class="text-danger"
                  value="danger"
                  label="amarillo"
                ></el-option>
              </el-select>

              <br /><br /><br />

              <el-select
                v-model="iotLabelConfig.column"
                class="select-success"
                placeholder="Select Column Width"
                style="width: 100%;"
              >
                <el-option
                  class="text-dark"
                  value="col-lg-3"
                  label="smallsize"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-lg-4"
                  label="4 size"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-lg-5"
                  label="5 size"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-lg-6"
                  label="mediumsize"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-lg-7"
                  label="7 size"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-lg-8"
                  label="8 size"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-lg-9"
                  label="9 size"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-lg-12"
                  label="bigsize"
                ></el-option>
              </el-select>

              <br /><br />
            </div>

            <!-- FORM RT INFO TYPE -->
            <div v-if="widgetType == 'rtinfo'">
              <base-input
                v-model="iotRtInfoConfig.variableFullName"
                label="Var Name"
                type="text"
              ></base-input>

              <base-input
                v-model="iotRtInfoConfig.unit"
                label="Unit"
                type="text"
              ></base-input>

              <base-input
                v-model="iotRtInfoConfig.icon"
                label="Icon"
                type="text"
              ></base-input>

              <br />

              <base-input
                v-model="iotRtInfoConfig.variableSendFreq"
                label="Send Freq"
                type="text"
              ></base-input>

              <br />

              <el-select
                v-model="iotRtInfoConfig.class"
                class="select-success"
                placeholder="Select Class"
                style="width: 100%;"
              >
                <el-option
                  class="text-success"
                  value="success"
                  label="verde"
                ></el-option>
                <el-option
                  class="text-primary"
                  value="primary"
                  label="azul"
                ></el-option>
                <el-option
                  class="text-warning"
                  value="warning"
                  label="naranja"
                ></el-option>
                <el-option
                  class="text-danger"
                  value="danger"
                  label="amarillo"
                ></el-option>
              </el-select>

              <br /><br /><br />

              <el-select
                v-model="iotRtInfoConfig.column"
                class="select-success"
                placeholder="Select Column Width"
                style="width: 100%;"
              >
                <el-option
                  class="text-dark"
                  value="col-lg-3"
                  label="small size"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-lg-4"
                  label="4 size"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-lg-5"
                  label="5 size"
                ></el-option>
                <el-option
                  class="text-dark"
                  value="col-lg-6"
                  label="medium size"
                ></el-option>
              </el-select>

              <br /><br />
            </div>

            <!-- FORMS MAP TYPE -->
            <div v-if="widgetType == 'mapa'">
              <base-input
                v-model="iotMapa.variableFullName"
                label="Nombre"
                type="text"
              >
              </base-input>

              <base-input
                v-model="iotMapa.variableSendFreq"
                label="Frecuencia"
                type="text"
              ></base-input>

              <el-select
                v-model="iotMapa.column"
                class="select-success"
                placeholder="Select Column Width"
                style="width: 100%;"
              >
                <el-option
                  class="text-dark"
                  value="col-6"
                  label="Display pequeño"
                ></el-option>

                <el-option
                  class="text-dark"
                  value="col-12"
                  label="Display grande"
                ></el-option>
              </el-select>

              <br /><br />
            </div>

            <!-- FORMS MAP TRACKING TYPE -->
            <div v-if="widgetType == 'tracking'">
              <base-input
                v-model="iotTracking.variableFullName"
                label="Nombre"
                type="text"
              >
              </base-input>

              <base-input
                v-model="iotTracking.variableSendFreq"
                label="Frecuencia"
                type="text"
              ></base-input>

              <el-select
                v-model="iotTracking.column"
                class="select-success"
                placeholder="Select Column Width"
                style="width: 100%;"
              >
                <el-option
                  class="text-dark"
                  value="col-6"
                  label="Media Pantalla"
                ></el-option>

                <el-option
                  class="text-dark"
                  value="col-12"
                  label="Grande"
                ></el-option>
              </el-select>

              <br /><br />
            </div>
          </div>

          <!-- WIDGET PREVIEW -->
          <div class="col-12">
            <Rtnumberchart
              v-if="widgetType == 'numberchart'"
              :config="ncConfig"
            ></Rtnumberchart>
            <Iotswitch
              v-if="widgetType == 'switch'"
              :config="iotSwitchConfig"
            ></Iotswitch>
            <Iotbutton
              v-if="widgetType == 'button'"
              :config="configButton"
            ></Iotbutton>
            <Iotindicator
              v-if="widgetType == 'indicator'"
              :config="iotIndicatorConfig"
            ></Iotindicator>
            <Iotlastconect
              v-if="widgetType == 'lastconect'"
              :config="iotLastconectConfig"
            ></Iotlastconect>
            <Iotlabel
              v-if="widgetType == 'label'"
              :config="iotLabelConfig"
            ></Iotlabel>
            <Rtinfo
              v-if="widgetType == 'rtinfo'"
              :config="iotRtInfoConfig"
            ></Rtinfo>
            <Map v-if="widgetType == 'mapa'" :config="iotMapa"></Map>
            <Tracking
              v-if="widgetType == 'tracking'"
              :config="iotTracking"
            ></Tracking>
          </div>
        </div>

        <!-- ADD WIDGET BUTTON -->
        <div class="row pull-right">
          <div class="col-12">
            <base-button
              native-type="submit"
              type="warning"
              class="mb-3"
              size="lg"
              @click="addNewWidget()"
            >
              AGREGAR INDICADOR
            </base-button>
          </div>
        </div>
      </card>
    </div>

    <!-- DASHBOARD PREVIEW -->

    <div class="row">
      <div
        v-for="(widget, index) in widgets"
        :key="index"
        :class="[widget.column]"
      >
        <i
          aria-hidden="true"
          class="fa fa-trash text-warning pull-right"
          @click="deleteWidget(index)"
          style="margin-bottom: 10px;"
        ></i>

        <Rtnumberchart
          v-if="widget.widget == 'numberchart'"
          :config="widget"
        ></Rtnumberchart>

        <Iotswitch
          v-if="widget.widget == 'switch'"
          :config="widget"
        ></Iotswitch>

        <Iotbutton
          v-if="widget.widget == 'button'"
          :config="widget"
        ></Iotbutton>

        <Iotindicator
          v-if="widget.widget == 'indicator'"
          :config="widget"
        ></Iotindicator>

        <Iotlastconect
          v-if="widget.widget == 'lastconect'"
          :config="widget"
        ></Iotlastconect>

        <Iotlabel v-if="widget.widget == 'label'" :config="widget"></Iotlabel>

        <Rtinfo v-if="widget.widget == 'rtinfo'" :config="widget"></Rtinfo>

        <Map v-if="widget.widget == 'mapa'" :config="widget"></Map>

        <Tracking
          v-if="widget.widget == 'tracking'"
          :config="widget"
        ></Tracking>
      </div>
    </div>

    <!-- SAVE TEMPLATE FORM-->

    <div class="row" v-if="widgets.length > 0">
      <card>
        <div slot="header">
          <h4 class="card-title">PLANTILLA DEL DISPOSITIVO</h4>
        </div>

        <div class="row">
          <base-input
            class="col-12"
            v-model="templateName"
            label="Plantilla - Ej: casa, campo, oficina"
            type="text"
          >
          </base-input>

          <base-input
            class="col-12"
            v-model="templateDescription"
            label="Descripción de la plantilla"
            type="text"
          >
          </base-input>
        </div>

        <br /><br />

        <div class="row">
          <div class="col-12">
            <base-button
              native-type="submit"
              type="warning"
              class="mb-3 pull-right"
              size="lg"
              @click="saveTemplate()"
              :disabled="widgets.length == 0"
            >
              AGREGAR
            </base-button>
          </div>
        </div>
      </card>
    </div>

    <!-- TEMPLATES TABLE -->

    <div class="row">
      <card card-body-classes="table-full-width">
        <div slot="header">
          <h4 class="card-title">PLANTILLAS AGREGADAS</h4>
        </div>

        <el-table :data="templates">
          <el-table-column min-width="50" label="#" align="center">
            <div class="photo" slot-scope="{ row, $index }">
              {{ $index + 1 }}
            </div>
          </el-table-column>

          <el-table-column
            min-width="150"
            prop="name"
            label="Nombre"
          ></el-table-column>

          <el-table-column
            min-width="150"
            prop="description"
            label="Descripción"
          ></el-table-column>

          <el-table-column
            min-width="100"
            prop="widgets.length"
            label="Sensores"
          ></el-table-column>

          <el-table-column
            min-width="160"
            header-align="right"
            align="right"
            label="ELIMINAR PLANTILLA"
          >
            <div slot-scope="{ row, $index }" class="text-right table-actions">
              <el-tooltip
                content="Eliminar"
                effect="light"
                :open-delay="300"
                placement="top"
              >
                <base-button
                  @click="handledeleteTemplate(row)"
                  type="warning"
                  icon
                  size="sm"
                  class="btn-link"
                >
                  <i class="tim-icons icon-simple-remove "></i>
                </base-button>
              </el-tooltip>
            </div>
          </el-table-column>
        </el-table>
      </card>
    </div>
  </div>
</template>

<script>
import { Table, TableColumn } from "element-ui";
import { Select, Option } from "element-ui";

import Iotlastconect from "../components/Widgets/Iotlastconect.vue";

import swal from "sweetalert2";

export default {
  middleware: "userpro",
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Option.name]: Option,
    [Select.name]: Select
  },
  data() {
    return {
      widgets: [],
      templates: [],
      widgetType: "",
      templateName: "",
      templateDescription: "",

      ncConfig: {
        userId: "sampleuserid",
        selectedDevice: {
          name: "Home",
          dId: "8888"
        },
        variableFullName: "temperature",
        variable: "varname",
        variableType: "input",
        variableSendFreq: "30",
        unit: "Watts",
        class: "success",
        column: "col-12",
        decimalPlaces: 2,
        widget: "numberchart",
        icon: "fa-sun",
        chartTimeAgo: 60,
        demo: true
      },

      iotSwitchConfig: {
        userId: "userid",
        selectedDevice: {
          name: "Home",
          dId: "8888"
        },
        variableFullName: "Luz",
        variable: "varname",
        variableType: "output",
        class: "danger",
        widget: "switch",
        icon: "fa-lightbulb",
        column: "col-6"
      },

      iotIndicatorConfig: {
        userId: "userid",
        selectedDevice: {
          name: "Home",
          dId: "8888"
        },
        variableFullName: "temperature",
        variable: "varname",
        variableType: "input",
        variableSendFreq: "30",
        class: "success",
        widget: "indicator",
        icon: "fa-bath",
        column: "col-6"
      },

      configButton: {
        userId: "userid",
        selectedDevice: {
          name: "Home",
          dId: "8888",
          templateName: "Power Sensor",
          templateId: "984237562348756ldksjfh",
          saverRule: false
        },
        variableFullName: "Pump",
        variable: "var1",
        variableType: "output",
        icon: "fa-sun",
        column: "col-6",
        widget: "button",
        class: "danger",
        message: ""
      },

      iotLastconectConfig: {
        userId: "userid",
        selectedDevice: {
          name: "Home",
          dId: "8888"
        },
        variableFullName: "Última Conexión a DB",
        variable: "varname",
        variableType: "input",
        variableSendFreq: "120",
        class: "success",
        widget: "lastconect",
        icon: "fa-clock",
        column: "col-lg-6",
        msg: "fff"
      },

      iotLabelConfig: {
        userId: "userid",
        selectedDevice: {
          name: "Home",
          dId: "8888"
        },
        variableFullName: "Mi dato a mostrar",
        variable: "varname",
        variableType: "input",
        variableSendFreq: "30",
        class: "success",
        widget: "label",
        icon: "fa-bolt",
        column: "col-lg-6",
        msg: "fff"
      },

      iotRtInfoConfig: {
        userId: "userid",
        selectedDevice: {
          name: "Home",
          dId: "8888"
        },
        variableFullName: "Mi dato a mostrar",
        variable: "varname",
        variableType: "input",
        unit: "Watts",
        decimalPlaces: 2,
        variableSendFreq: "30",
        class: "success",
        widget: "rtinfo",
        icon: "fa-bolt",
        column: "col-lg-4"
      },

      iotMapa: {
        userId: "userid",
        selectedDevice: {
          name: "Mapa",
          dId: "8888"
        },
        variableFullName: "ubicación",
        variable: "varname",
        variableType: "input",
        variableSendFreq: "20",
        class: "primary",
        widget: "mapa",
        icon: "fa-map-marker-alt",
        column: "col-6"
      },

      iotTracking: {
        userId: "userid",
        selectedDevice: {
          name: "Mapa Tracking",
          dId: "8888"
        },
        variableFullName: "ubicación",
        variable: "varname",
        variableType: "input",
        variableSendFreq: "20",
        class: "primary",
        widget: "tracking",
        icon: "fa-map-marker-alt",
        column: "col-6"
      }
    };
  },

  mounted() {
    this.getTemplates();
  },

  methods: {
    //Get Templates
    async getTemplates() {
      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token
        }
      };

      try {
        const res = await this.$axios.get("/template", axiosHeaders);
        console.log(res.data);

        if (res.data.status == "success") {
          this.templates = res.data.data;
        }
      } catch (error) {
        this.$notify({
          type: "default",
          icon: "tim-icons icon-alert-circle-exc",
          message: "Error al obtener plantillas"
        });
        console.log(error);
        return;
      }
    },

    //Save Template
    async saveTemplate() {
      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token
        }
      };

      console.log(axiosHeaders);

      const toSend = {
        template: {
          name: this.templateName,
          description: this.templateDescription,
          widgets: this.widgets,
          admin: false
        }
      };

      try {
        const res = await this.$axios.post("/template", toSend, axiosHeaders);

        if (res.data.status == "success") {
          this.$notify({
            type: "warning",
            icon: "tim-icons icon-alert-circle-exc",
            message: "PLANTILLA CREADA!!"
          });
          this.getTemplates();

          this.widgets = [];
        }
      } catch (error) {
        this.$notify({
          type: "default",
          icon: "tim-icons icon-alert-circle-exc",
          message: "Error al crear plantilla"
        });
        console.log(error);
        return;
      }
    },

    handledeleteTemplate(row) {
      swal({
        title: "ELIMINAR PLANTILLA?",
        text: `La plantilla ${row.name.toUpperCase()} será eliminada`,
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn btn-warning btn-fill",
        cancelButtonClass: "btn btn-primary btn-fill",
        confirmButtonText: "Ok, eliminar plantilla!",
        cancelButtonText: "Cerrar",
        buttonsStyling: false
      }).then(result => {
        if (result.value) {
          this.deleteTemplate(row);
        }
      });
    },

    //Delete Template
    async deleteTemplate(template) {
      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token
        },
        params: {
          templateId: template._id,
          ad: false
        }
      };

      console.log(axiosHeaders);

      try {
        const res = await this.$axios.delete("/template", axiosHeaders);

        console.log(res.data);

        if (res.data.status == "fail" && res.data.error == "template in use") {
          this.$notify({
            type: "default",
            icon: "tim-icons icon-alert-circle-exc",
            message:
              template.name + " se encuentra vinculado. Elimine el dispositivo"
          });

          return;
        }

        if (res.data.status == "success") {
          this.$notify({
            type: "warning",
            icon: "tim-icons icon-check-2",
            message: template.name + " ha sido eliminado"
          });

          this.getTemplates();
        }
      } catch (error) {
        this.$notify({
          type: "default",
          icon: "tim-icons icon-alert-circle-exc",
          message: "Error al obtener plantilla"
        });
        console.log(error);
        return;
      }
    },

    //Add Widget
    addNewWidget() {
      if (this.widgetType == "numberchart") {
        this.ncConfig.variable = this.makeid(10);
        this.widgets.push(JSON.parse(JSON.stringify(this.ncConfig)));
      }

      if (this.widgetType == "switch") {
        this.iotSwitchConfig.variable = this.makeid(10);
        this.widgets.push(JSON.parse(JSON.stringify(this.iotSwitchConfig)));
      }

      if (this.widgetType == "button") {
        this.configButton.variable = this.makeid(10);
        this.widgets.push(JSON.parse(JSON.stringify(this.configButton)));
      }

      if (this.widgetType == "indicator") {
        this.iotIndicatorConfig.variable = this.makeid(10);
        this.widgets.push(JSON.parse(JSON.stringify(this.iotIndicatorConfig)));
      }

      if (this.widgetType == "lastconect") {
        this.iotLastconectConfig.variable = this.makeid(10);
        this.widgets.push(JSON.parse(JSON.stringify(this.iotLastconectConfig)));
      }

      if (this.widgetType == "label") {
        this.iotLabelConfig.variable = this.makeid(10);
        this.widgets.push(JSON.parse(JSON.stringify(this.iotLabelConfig)));
      }

      if (this.widgetType == "rtinfo") {
        this.iotRtInfoConfig.variable = this.makeid(10);
        this.widgets.push(JSON.parse(JSON.stringify(this.iotRtInfoConfig)));
      }

      if (this.widgetType == "mapa") {
        this.iotMapa.variable = this.makeid(10);
        this.widgets.push(JSON.parse(JSON.stringify(this.iotMapa)));
      }

      if (this.widgetType == "tracking") {
        this.iotTracking.variable = this.makeid(10);
        this.widgets.push(JSON.parse(JSON.stringify(this.iotTracking)));
      }
    },

    //Delete Widget
    deleteWidget(index) {
      this.widgets.splice(index, 1);
    },

    makeid(length) {
      var result = "";
      var characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      var charactersLength = characters.length;
      for (var i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }
      return result;
    }
  }
};
</script>
