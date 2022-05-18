<template>
  <div>
    <div class="col-md-12">
      <div class="row">
        <card class="card-login card-white">
          <collapse :multiple-active="false">
            <collapse-item title="AGREGAR UN CLIENTE">
              <div class="container login-page">
                <div>
                  <i class="fas fa-address-card fa-2x"></i>
                  <div>
                    <base-input
                      name="name"
                      v-model="user.name"
                      placeholder="Nombre"
                      addon-left-icon="tim-icons icon-badge"
                    >
                    </base-input>

                    <base-input
                      name="email"
                      v-model="user.email"
                      placeholder="Email"
                      addon-left-icon="tim-icons icon-email-85"
                    >
                    </base-input>

                    <base-input
                      name="password"
                      v-model="user.password"
                      type="password"
                      placeholder="Contraseña"
                      addon-left-icon="tim-icons icon-lock-circle"
                    >
                    </base-input>

                    <base-input
                      name="confirm_password"
                      v-model="userPassword.confirm_password"
                      type="password"
                      placeholder="Confirmar contraseña"
                      addon-left-icon="tim-icons icon-check-2"
                    >
                    </base-input>

                    <el-select
                      name="type"
                      v-model="user.type"
                      placeholder="Seleccione el tipo de usuario"
                      class="select-primary"
                      style="width:100%"
                    >
                      <!-- label se utiliza para el contenido de las opciones y value debe colocarse -->
                      <el-option
                        class="text-dark"
                        label="Cliente Basic"
                        value="0"
                      ></el-option>
                      <el-option
                        class="text-dark"
                        label="Cliente PRO"
                        value="1"
                      ></el-option>
                      <el-option
                        class="text-dark"
                        label="Administrador"
                        value="2"
                      ></el-option>
                    </el-select>
                  </div>

                  <div slot="footer">
                    <base-button
                      style="margin-top:50px;"
                      native-type="submit"
                      type="warning"
                      class="mb-3"
                      size="lg"
                      @click="register()"
                      block
                    >
                      AGREGAR CLIENTE
                    </base-button>
                  </div>
                </div>
              </div>
            </collapse-item>
            <collapse-item title="ADMINISTRAR DISPOSITIVOS">
              <div class="row">
                <card>
                  <div class="row">
                    <div class="col-12">
                      <el-select
                        v-model="clienteselected"
                        class="select-primary"
                        placeholder="Seleccione el cliente"
                        style="width: 100%;"
                      >
                        <el-option
                          v-for="(client, index) in clients"
                          :key="client._id"
                          class="text-dark"
                          :value="client._id"
                          :label="client.email"
                        ></el-option>
                      </el-select>
                    </div>
                  </div>
                </card>
              </div>
              <!-- WIDGET CONFIGURATOR -->
              <div class="row" v-if="clienteselected != ''">
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
                  label="col-6"
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
                            label="col-6"
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
                            label="col-6"
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
                            label="col-6"
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

                  <Iotlabel
                    v-if="widget.widget == 'label'"
                    :config="widget"
                  ></Iotlabel>

                  <Rtinfo
                    v-if="widget.widget == 'rtinfo'"
                    :config="widget"
                  ></Rtinfo>

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
                      label="Plantillas - Ej: casa, campo, pileta"
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

              <div class="row" v-if="clienteselected != ''">
                <card>
                  <div slot="header">
                    <h4 class="card-title">AGREGAR DISPOSITIVOS</h4>
                    <p>
                      Ingresa el nombre, número de serie y la plantilla.
                    </p>
                  </div>

                  <div class="row">
                    <div class="col-12">
                      <base-input
                        label="DISPOSITIVO"
                        type="text"
                        placeholder="Ej: Casa Campo"
                        v-model="newDevice.name"
                      >
                      </base-input>
                    </div>

                    <div class="col-12">
                      <base-input
                        label="SERIE"
                        type="text"
                        placeholder="Ej: 777222"
                        v-model="newDevice.dId"
                      >
                      </base-input>
                    </div>

                    <div class="col-12">
                      <slot name="label">
                        <label> PLANTILLAS </label>
                      </slot>

                      <el-select
                        v-model="selectedIndexTemplate"
                        placeholder="Seleccione la plantilla"
                        class="select-primary"
                        style="width:100%"
                      >
                        <el-option
                          v-for="(template, index) in templates"
                          :key="template._id"
                          class="text-dark"
                          :value="index"
                          :label="template.name"
                        ></el-option>
                      </el-select>
                    </div>

                    <div class="col-12">
                      <slot name="label">
                        <label> UBICACIÓN DISPOSITIVO </label>
                      </slot>
                      <br />
                      <div id="map-wrap" style="height: 350px; width: 100%">
                        <l-map :zoom="zoom" :center="center">
                          <l-tile-layer :url="url"></l-tile-layer>

                          <l-marker
                            :draggable="true"
                            @update:latLng="onDrag"
                            :lat-lng="center"
                          >
                            <l-icon :icon-url="icon" :icon-size="iconSize" />
                            <l-popup>
                              Ubicar Dispositivo
                            </l-popup>
                          </l-marker>
                        </l-map>
                      </div>
                    </div>
                  </div>

                  <div class="row pull-right">
                    <div class="col-12">
                      <base-button
                        @click="createNewDevice()"
                        type="warning"
                        class="mb-3"
                        size="lg"
                        >AGREGAR</base-button
                      >
                    </div>
                  </div>
                </card>
              </div>
            </collapse-item>
          </collapse>
        </card>
      </div>
    </div>

    <div class="col-md-8 ml-auto mr-auto">
      <p class="text-center">
        En esta sección, usted como administrador puede gestionar el estado de
        todas las cuentas de sus clientes e inhabilitarlas por falta de pago
      </p>
    </div>

    <br />
    <br />

    <div class="col-12">
      <div class="row">
        <card card-body-classes="table-full-width">
          <div>
            <div
              class="col-12 d-flex justify-content-center justify-content-sm-between flex-wrap"
            >
              <el-select
                class="select-primary mb-3 pagination-select"
                v-model="pagination.perPage"
                placeholder="Per page"
              >
                <el-option
                  class="select-primary"
                  v-for="item in pagination.perPageOptions"
                  :key="item"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select>

              <base-input>
                <el-input
                  type="search"
                  class="mb-3 search-input"
                  clearable
                  prefix-icon="el-icon-search"
                  placeholder="Buscar"
                  v-model="searchQuery"
                  aria-controls="datatables"
                >
                </el-input>
              </base-input>
            </div>
            <el-table :data="queriedData">
              <el-table-column
                v-for="column in tableColumns"
                :key="column.label"
                :min-width="column.minWidth"
                :prop="column.prop"
                :label="column.label"
                sortable
              >
              </el-table-column>
              <el-table-column :min-width="200" align="right" label="Acciones">
                <div slot-scope="props">
                  <el-tooltip
                    content="Configuración de cuenta"
                    :open-delay="300"
                    placement="top"
                  >
                    <base-button
                      @click.native="handleLike(props.$index, props.row)"
                      class="like btn-link"
                      type="warning"
                      size="sm"
                      icon
                    >
                      <i class="far fa-check-circle"></i>
                    </base-button>
                  </el-tooltip>

                  <el-tooltip
                    content="Dispositivos de la cuenta"
                    :open-delay="300"
                    placement="top"
                  >
                    <base-button
                      @click.native="handleEdit(props.$index, props.row)"
                      class="edit btn-link"
                      type="warning"
                      size="sm"
                      icon
                    >
                      <i class="fas fa-microchip"></i>
                    </base-button>
                  </el-tooltip>

                  <el-tooltip
                    content="Plantillas de la cuenta"
                    :open-delay="300"
                    placement="top"
                  >
                    <base-button
                      @click.native="
                        handleEditUbication(props.$index, props.row)
                      "
                      class="edit btn-link"
                      type="warning"
                      size="sm"
                      icon
                    >
                      <i class="fas fa-stream"></i>
                    </base-button>
                  </el-tooltip>

                  <el-tooltip
                    content="Restablecer contraseña"
                    :open-delay="300"
                    placement="top"
                  >
                    <base-button
                      @click.native="
                        handleEditPassword(props.$index, props.row)
                      "
                      class="edit btn-link"
                      type="warning"
                      size="sm"
                      icon
                    >
                      <i class="fas fa-lock-open"></i>
                    </base-button>
                  </el-tooltip>

                  <el-tooltip
                    content="Eliminar cuenta"
                    :open-delay="300"
                    placement="top"
                  >
                    <base-button
                      @click.native="handleDelete(props.$index, props.row)"
                      class="remove btn-link"
                      type="danger"
                      size="sm"
                      icon
                    >
                      <i class="tim-icons icon-simple-remove"></i>
                    </base-button>
                  </el-tooltip>
                </div>
              </el-table-column>
            </el-table>
          </div>
          <div
            slot="footer"
            class="col-12 d-flex justify-content-center justify-content-sm-between flex-wrap"
          >
            <div class="">
              <p class="card-category">
                Cliente {{ from + 1 }} a {{ to }} de {{ total }} clientes
              </p>
            </div>
            <base-pagination
              class="pagination-no-border"
              v-model="pagination.currentPage"
              :per-page="pagination.perPage"
              :total="total"
            >
            </base-pagination>
          </div>
        </card>
      </div>
    </div>

    <!-- CLIENTS DEVICES -->
    <modal :show.sync="modals.classic" headerClasses="justify-content-center">
      <h4 slot="header" class="title title-up">DISPOSITIVOS ASOCIADOS</h4>
      <div v-if="this.devices.length != '0'">
        <p v-for="device in this.devices">
          <i class="fas fa-check text-success" v-if="device.status == true"></i>
          <i class="fas fa-ban text-warning" v-if="device.status == false"></i>
          {{ device.name.toUpperCase() }}
         
          ({{ device.dId }})

          <!-- <el-tooltip
            content="Generar una nueva contraseña"
            :open-delay="300"
            placement="top"
          >
            <base-button
              @click.native="handleResetDevicePassword(device)"
              class="remove btn-link"
              type="info"
              size="sm"
              icon
            >
              <i class="fas fa-fingerprint"></i>
            </base-button>
          </el-tooltip> -->

          ({{ device.password }})

          <i class="fas fa-long-arrow-alt-right"></i>

          {{ device.templateName.toUpperCase() }}

          <el-tooltip
            content="Eliminar dispositivo"
            :open-delay="300"
            placement="top"
          >
            <base-button
              @click.native="handleDeleteDevice(device)"
              class="remove btn-link"
              type="info"
              size="sm"
              icon
            >
              <i class="fas fa-trash"></i>
            </base-button>
          </el-tooltip>
        </p>
      </div>
      <template slot="footer">
        <base-button type="warning" round @click.native="modals.classic = false"
          >OK
        </base-button>
      </template>
    </modal>

    <!-- CLIENTS TEMPLATES -->
    <modal
      :show.sync="modals.notice"
      headerClasses="justify-content-center"
      footerClasses="justify-content-center"
      type="notice"
    >
      <h4 slot="header" class="title title-up">PLANTILLAS ASOCIADAS</h4>

      <div v-if="this.templates.length != '0'">
        <p v-for="ubicacion in this.templates">
          <i class="fas fa-check text-success"></i>

          {{ ubicacion.name.toUpperCase() }}

          <el-tooltip
            content="Eliminar Plantilla"
            :open-delay="300"
            placement="top"
          >
            <base-button
              @click.native="handleDeleteUbication(ubicacion)"
              class="remove btn-link"
              type="info"
              size="sm"
              icon
            >
              <i class="fas fa-trash"></i>
            </base-button>
          </el-tooltip>
        </p>
      </div>

      <div slot="footer" class="justify-content-center">
        <base-button type="warning" round @click.native="modals.notice = false"
          >OK
        </base-button>
      </div>
    </modal>

    <!-- small modal -->
    <modal
      :show.sync="modals.mini"
      class="modal-warning"
      :show-close="false"
      headerClasses="justify-content-center"
      type="mini"
    >
      <div slot="header" class="modal-profile" style="margin:10px;">
        <i
          class="fas fa-check text-warning"
          title="Habilitar cuenta"
          @click="
            updateclient(
              idselected.status,
              idselected._id,
              idselected.email,
              idselected.type,
              'status'
            )
          "
          style="cursor:pointer"
          v-if="this.idselected.status == 'Deshabilitado'"
        ></i>
        <i
          class="fas fa-times text-warning"
          title="Deshabilitar cuenta"
          @click="
            updateclient(
              idselected.status,
              idselected._id,
              idselected.email,
              idselected.type,
              'status'
            )
          "
          style="cursor:pointer"
          v-if="this.idselected.status == 'Habilitado'"
        ></i>
      </div>
      <div
        slot="header"
        class="modal-profile"
        style="margin:10px;"
        v-if="this.idselected.type != 'Administrador'"
      >
        <i
          class="fas fa-arrow-up text-warning"
          title="Actualizar a cuenta pro"
          @click="
            updateclient(
              idselected.status,
              idselected._id,
              idselected.email,
              idselected.type,
              'type'
            )
          "
          style="cursor:pointer"
          v-if="this.idselected.type == 'Cliente basic'"
        ></i>
        <i
          class="fas fa-arrow-down text-warning"
          title="Actualizar a cuenta basic"
          @click="
            updateclient(
              idselected.status,
              idselected._id,
              idselected.email,
              idselected.type,
              'type'
            )
          "
          style="cursor:pointer"
          v-if="this.idselected.type == 'Cliente pro'"
        ></i>
      </div>
      <p style="font-weight:bold;">CONFIGURACIÓN DE CUENTA</p>
      <template slot="footer">
        <base-button type="warning" round @click.native="modals.mini = false"
          >CERRAR
        </base-button>
      </template>
    </modal>
  </div>
</template>

<script>
import { Table, TableColumn } from "element-ui";
import { Select, Option } from "element-ui";

import { BasePagination } from "@/components";
import users from "../util/mock-users";
import Fuse from "fuse.js";
import swal from "sweetalert2";

import { TabPane, Tabs, Collapse, CollapseItem } from "@/components";

import { Modal } from "@/components";

import { latLng, Icon } from "leaflet";
import {
  LMap,
  LTileLayer,
  LMarker,
  LPopup,
  LTooltip,
  LIcon
} from "vue2-leaflet";
import imagetrue from "../static/img/map.png";

delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});

export default {
  name: "paginated",
  middleware: "admin",
  components: {
    BasePagination,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Option.name]: Option,
    [Select.name]: Select,
    TabPane,
    Tabs,
    Collapse,
    CollapseItem,
    Modal,
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    LTooltip,
    LIcon
  },
  computed: {
    /***
     * Returns a page from the searched data or the whole data. Search is performed in the watch section below
     */
    queriedData() {
      let result = this.tableData;
      if (this.searchedData.length > 0) {
        result = this.searchedData;
      }
      return result.slice(this.from, this.to);
    },
    to() {
      let highBound = this.from + this.pagination.perPage;
      if (this.total < highBound) {
        highBound = this.total;
      }
      return highBound;
    },
    from() {
      return this.pagination.perPage * (this.pagination.currentPage - 1);
    },
    total() {
      return this.searchedData.length > 0
        ? this.searchedData.length
        : this.tableData.length;
    }
  },
  head() {
    return {
      link: [
        {
          rel: "stylesheet",
          href: "https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
        }
      ]
    };
  },
  data() {
    return {
      widgets: [],
      templates: [],
      widgetType: "",
      templateName: "",
      templateDescription: "",
      devices: "",
      email: "",
      idselected: [],

      selectedIndexTemplate: null,
      newDevice: {
        name: "",
        dId: "",
        templateId: "",
        templateName: "",
        lat: "",
        long: "",
        lastUbication: "",
        status: false
      },
      url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
      zoom: 6,
      center: latLng(4.66, -74.09),
      icon: imagetrue,
      iconSize: [40, 40],

      notifications: {
        topCenter: false
      },

      modals: {
        classic: false,
        notice: false,
        mini: false
      },

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
        icon: "fa-bath",
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
        icon: "fa-lightbulb",
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
      },

      activeName: "first",
      user: {
        name: "",
        email: "",
        password: "",
        type: "",
        status: true,
        registered: Date.now(),
        lock: "0"
      },
      userPassword: {
        confirm_password: ""
      },
      pagination: {
        perPage: 5,
        currentPage: 1,
        perPageOptions: [5, 10, 25, 50],
        total: 0
      },
      searchQuery: "",
      propsToSearch: ["email", "type"],
      tableColumns: [
        {
          prop: "name",
          label: "Cliente",
          minWidth: 140
        },
        {
          prop: "email",
          label: "Email",
          minWidth: 180
        },
        {
          prop: "status",
          label: "Estado",
          minWidth: 120
        },
        {
          prop: "type",
          label: "Cuenta",
          minWidth: 140
        },
        {
          prop: "registered",
          label: "Registrado",
          minWidth: 140
        }
      ],
      tableData: [],
      searchedData: [],
      fuseSearch: null,
      clients: [],
      clienteselected: ""
    };
  },
  methods: {
    register() {
      if (this.user.password === this.userPassword.confirm_password) {
        this.$axios
          .post("/register", this.user)
          .then(res => {
            //success! - Usuario creado.
            if (res.data.status == "success") {
              this.$notify({
                type: "warning",
                icon: "tim-icons icon-check-2",
                message: "Cuenta registrada!!"
              });

              this.user.name = "";
              this.user.password = "";
              this.user.email = "";
              this.userPassword.confirm_password = "";
              this.user.type = "";
              this.user.registered = "";
              this.getClients();

              window.location.href = "/register";

              return;
            }
          })
          .catch(e => {
            console.log(e.response.data);

            if (e.response.data.error.errors.email.kind == "unique") {
              this.$notify({
                type: "warning",
                icon: "tim-icons icon-alert-circle-exc",
                message: "Ingrese otro email"
              });

              return;
            } else {
              this.$notify({
                type: "warning",
                icon: "tim-icons icon-alert-circle-exc",
                message: "Error al registrarse"
              });

              return;
            }
          });
      } else {
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: "Las contraseñas ingresadas no coinciden"
        });
      }
    },
    handleLike(index, row) {
      this.idselected = row;
      this.modals.mini = true;
    },

    handleEdit(index, row) {
      this.clientsdevices(row._id, row.email);
      this.email = row.email;
    },

    handleEditUbication(index, row) {
      this.clientstemplates(row._id, row.email);
    },

    handleEditPassword(index, row) {
      swal({
        title: "RESTABLECER CONTRASEÑA?",
        text: `La contraseña del cliente ${row.email} será modificada a "123"`,
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn btn-warning btn-fill",
        cancelButtonClass: "btn btn-primary btn-fill",
        confirmButtonText: "Ok, restablecer contraseña!",
        cancelButtonText: "Cerrar",
        buttonsStyling: false
      }).then(result => {
        if (result.value) {
          this.resetPassword(row);
          swal({
            title: "Contraseña restablecida",
            text: `La contraseña del cliente ${row.email} ha sido modificada`,
            type: "success",
            confirmButtonClass: "btn btn-warning btn-fill",
            buttonsStyling: false
          });
        }
      });
    },

    handleDelete(index, row) {
      this.deleteclient(index, row);
    },

    handleDeleteUbication(ubicacion) {
      swal({
        title: "ELIMINAR PLANTILLA?",
        text: `La plantilla ${ubicacion.name.toUpperCase()} será eliminada`,
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn btn-warning btn-fill",
        cancelButtonClass: "btn btn-primary btn-fill",
        confirmButtonText: "Ok, eliminar plantilla!",
        cancelButtonText: "Cerrar",
        buttonsStyling: false
      }).then(result => {
        if (result.value) {
          this.deleteUbication(ubicacion);
        }
      });
    },

    handleDeleteDevice(device) {
      swal({
        title: "ELIMINAR DISPOSITIVO?",
        text: `El dispositivo ${device.name.toUpperCase()} será eliminado`,
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn btn-warning btn-fill",
        cancelButtonClass: "btn btn-primary btn-fill",
        confirmButtonText: "Ok, eliminar dispositivo!",
        cancelButtonText: "Cerrar",
        buttonsStyling: false
      }).then(result => {
        if (result.value) {
          this.deleteDevice(device);
        }
      });
    },

    handleResetDevicePassword(device) {
      swal({
        title: "MODIFICAR CONTRASEÑA?",
        text: `La contraseña de conexión del dispositivo ${device.name.toUpperCase()} será modificada`,
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn btn-warning btn-fill",
        cancelButtonClass: "btn btn-primary btn-fill",
        confirmButtonText: "Ok, modificar contraseña!",
        cancelButtonText: "Cerrar",
        buttonsStyling: false
      }).then(result => {
        if (result.value) {
          this.resetdevicePassword(device);
        }
      });
    },

    async resetPassword(row) {
      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token
        }
      };

      const toSend = {
        user: row._id,
        ad: true
      };

      this.$axios
        .put("/updatepassword", toSend, axiosHeaders)
        .then(res => {
          if (res.data.status == "success") {
            this.$notify({
              type: "warning",
              icon: "tim-icons icon-check-2",
              message: "Contraseña modificada"
            });

            return;
          }
        })
        .catch(e => {
          console.log(e.response.data);

          this.$notify({
            type: "warning",
            icon: "tim-icons icon-alert-circle-exc",
            message: "Contraseña no modificada"
          });
        });
    },

    deleteclient(index, row) {
      swal({
        title: "ELIMINAR CLIENTE?",
        text: `La cuenta ${row.email} será eliminada`,
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn btn-warning btn-fill",
        cancelButtonClass: "btn btn-primary btn-fill",
        confirmButtonText: "Ok, eliminar cliente!",
        cancelButtonText: "Cerrar",
        buttonsStyling: false
      }).then(result => {
        if (result.value) {
          this.deleteRow(row);
          swal({
            title: "CUENTA ELIMINADA",
            text: `El cliente ${row.email} ha sido eliminado`,
            type: "success",
            confirmButtonClass: "btn btn-success btn-fill",
            buttonsStyling: false
          });
        }
      });
    },

    async deleteRow(row) {
      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token
        },
        params: {
          id: row._id
        }
      };

      try {
        const res = await this.$axios.delete("/listclients", axiosHeaders); //hago llamado a endpoint clients

        if (res.data.status == "success") {
          // si la respuesta fue exitosa

          let indexToDelete = this.tableData.findIndex(
            tableRow => tableRow.id === row.id
          );
          if (indexToDelete >= 0) {
            this.tableData.splice(indexToDelete, 1);
          }
        }
      } catch (error) {
        this.$notify({
          type: "default",
          icon: "tim-icons icon-alert-circle-exc",
          message: "ERROR AL ELIMINAR CLIENTE"
        });
        console.log(error);
        return;
      }
    },

    async resetdevicePassword(device) {
      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token
        }
      };

      const toSend = {
        Id: device.userId,
        dId: device.dId
      };

      try {
        const res = await this.$axios.post(
          "/updatedevice",
          toSend,
          axiosHeaders
        ); //hago llamado a endpoint clients

        if (res.data.status == "success") {
          // si la respuesta fue exitosa

          this.clientsdevices(device.userId, this.email);
          this.email = "";

          swal({
            title: "CONTRASEÑA MODIFICADA",
            text: `La contraseña de conexión del dispositivo ${device.name.toUpperCase()} ha sido modificada`,
            type: "success",
            confirmButtonClass: "btn btn-warning btn-fill",
            buttonsStyling: false
          });
        }
      } catch (error) {
        this.$notify({
          type: "default",
          icon: "tim-icons icon-alert-circle-exc",
          message: "ERROR AL ACTUALIZAR DISPOSITIVO"
        });
        console.log(error);
        return;
      }
    },

    async deleteDevice(device) {
      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token
        },
        params: {
          dId: device.dId,
          ad: true,
          uId: device.userId
        }
      };

      try {
        const res = await this.$axios.delete("/device", axiosHeaders); //hago llamado a endpoint clients

        if (res.data.status == "success") {
          // si la respuesta fue exitosa

          swal({
            title: "DISPOSITIVO ELIMINADO",
            text: `El dispositivo ${device.name.toUpperCase()} ha sido eliminado`,
            type: "success",
            confirmButtonClass: "btn btn-warning btn-fill",
            buttonsStyling: false
          });

          this.modals.classic = false;
        }
      } catch (error) {
        swal({
          title: "ERROR AL ELIMINAR DISPOSITIVO",
          text: `El dispositivo ${device.name.toUpperCase()} no se puede eliminar`,
          type: "warning",
          confirmButtonClass: "btn btn-warning btn-fill",
          buttonsStyling: false
        });
        console.log(error);
        return;
      }
    },

    async deleteUbication(ubication) {
      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token
        },
        params: {
          templateId: ubication._id,
          ad: true,
          uId: ubication.userId
        }
      };

      try {
        const res = await this.$axios.delete("/template", axiosHeaders); //hago llamado a endpoint clients

        if (res.data.status == "fail" && res.data.error == "template in use") {
          swal({
            title: "ERROR AL ELIMINAR PLANTILLA",
            text: `La plantilla ${ubication.name.toUpperCase()} se encuentra vinculada. Elimine el dispositivo asociado`,
            type: "warning",
            confirmButtonClass: "btn btn-warning btn-fill",
            buttonsStyling: false
          });

          return;
        }

        if (res.data.status == "success") {
          // si la respuesta fue exitosa

          swal({
            title: "PLANTILLA ELIMINADA",
            text: `La plantilla ${ubication.name.toUpperCase()} ha sido eliminada`,
            type: "success",
            confirmButtonClass: "btn btn-success btn-fill",
            buttonsStyling: false
          });

          this.modals.notice = false;
        }
      } catch (error) {
        this.$notify({
          type: "default",
          icon: "tim-icons icon-alert-circle-exc",
          message: "ERROR AL ELIMINAR LA PLANTILLA"
        });
        console.log(error);
        return;
      }
    },

    async updateclient(status, id, email, type, action) {
      this.modals.mini = false;
      this.idselected = [];

      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token
        }
      };

      const toSend = {
        client: {
          id: id,
          status: status,
          type: type,
          action: action
        }
      };

      try {
        const res = await this.$axios.put("/listclients", toSend, axiosHeaders); //hago llamado a endpoint clients

        if (res.data.status == "success") {
          // si la respuesta fue exitosa

          if (res.data.client != "") {
            swal({
              title: `CUENTA ACTUALIZADA`,
              text: `La cuenta ${email.toUpperCase()} se actualizó a ${res.data.client.toUpperCase()}`,
              buttonsStyling: false,
              type: "success",
              confirmButtonClass: "btn btn-warning btn-fill"
            });
          } else {
            if (status == "Habilitado") {
              status = "DESHABILITADA";
            } else {
              status = "HABILITADA";
            }

            swal({
              title: `CUENTA ${status}`,
              text: `${email.toUpperCase()}`,
              buttonsStyling: false,
              type: "success",
              confirmButtonClass: "btn btn-warning btn-fill"
            });
          }

          this.getClients();
        }
      } catch (error) {
        this.$notify({
          type: "default",
          icon: "tim-icons icon-alert-circle-exc",
          message: "ERROR AL ACTUALIZAR EL ESTADO DEL CLIENTE"
        });
        console.log(error);
        return;
      }
    },

    async clientsdevices(id, email) {
      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token
        }
      };

      const toSend = {
        client: {
          id: id
        }
      };

      try {
        const res = await this.$axios.post(
          "/clientsdevices",
          toSend,
          axiosHeaders
        ); //hago llamado a endpoint clients

        if (res.data.status == "success") {
          // si la respuesta fue exitosa

          let clientdevices = res.data.devices;

          if (clientdevices.length != "0") {
            for (var i = 0; i < clientdevices.length; i++) {
              let date = new Date(clientdevices[i].createdTime);

              clientdevices[i].createdTime =
                date.getDate() +
                "/" +
                (date.getMonth() + 1) +
                "/" +
                date.getFullYear() +
                " " +
                date.getHours() +
                ":" +
                date.getMinutes();
            }

            this.devices = clientdevices;
            this.modals.classic = true;
          } else {
            swal({
              title: email,
              text: `No tiene tiene dispositivos asociados`,
              type: "warning",
              buttonsStyling: false,
              confirmButtonClass: "btn btn-warning btn-fill"
            });
          }
        }
      } catch (error) {
        this.$notify({
          type: "default",
          icon: "tim-icons icon-alert-circle-exc",
          message: "ERROR AL LISTAR DISPOSITIVOS DE CLIENTES"
        });
        console.log(error);
        return;
      }
    },

    async clientstemplates(id, email) {
      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token
        }
      };

      const toSend = {
        template: {
          admin: true,
          clientId: id,
          getTemplates: true
        }
      };

      try {
        const res = await this.$axios.post("/template", toSend, axiosHeaders);
        console.log(res.data);

        if (res.data.status == "success") {
          this.templates = [];
          this.templates = res.data.data;

          if (res.data.data.length != 0) {
            this.modals.notice = true;
          } else {
            swal({
              title: email,
              text: `No tiene tiene plantillas asociadas`,
              type: "warning",
              buttonsStyling: false,
              confirmButtonClass: "btn btn-warning btn-fill"
            });
          }
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

    async getClients() {
      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token
        }
      };

      try {
        const res = await this.$axios.get("/listclients", axiosHeaders); //hago llamado a endpoint clients

        if (res.data.status == "success") {
          // si la respuesta fue exitosa

          this.clients = res.data.client; //lo que recupero de mongo se lo asigno a la variable clients

          for (var i = 0; i < this.clients.length; i++) {
            let date = this.unixToDate(parseInt(this.clients[i].registered));

            this.clients[i].registered = date;

            //cliente habilitado o no habilitado
            if (this.clients[i].status == true) {
              this.clients[i].status = "Habilitado";
            } else {
              this.clients[i].status = "Deshabilitado";
            }

            // tipo de cuenta del cliente
            if (this.clients[i].type == 2) {
              this.clients[i].type = "Administrador";
            } else if (this.clients[i].type == 1) {
              this.clients[i].type = "Cliente pro";
            } else if (this.clients[i].type == 0) {
              this.clients[i].type = "Cliente basic";
            }
          }

          this.tableData = this.clients;
        }
      } catch (error) {
        this.$notify({
          type: "default",
          icon: "tim-icons icon-alert-circle-exc",
          message: "Error al listar clientes"
        });
        console.log(error);
        return;
      }
    },

    //new device
    createNewDevice() {
      if (this.newDevice.name == "") {
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: "INGRESE EL NOMBRE DEL DISPOSITIVO"
        });
        return;
      }

      if (this.newDevice.dId == "") {
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: "INGRESE EL NÚMERO DE SERIE DEL DISPOSITIVO"
        });
        return;
      }

      if (this.selectedIndexTemplate == null) {
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: "SELECCIONE LA PLANTILLA DEL DISPOSITIVO"
        });
        return;
      }

      if (this.lat == null && this.long == null) {
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: "SELECCIONE UNA UBICACION"
        });
        return;
      }

      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token
        }
      };

      //ESCRIBIMOS EL NOMBRE Y EL ID DEL TEMPLATE SELECCIONADO EN EL OBJETO newDevice
      this.newDevice.templateId = this.templates[
        this.selectedIndexTemplate
      ]._id;
      this.newDevice.templateName = this.templates[
        this.selectedIndexTemplate
      ].name;

      const toSend = {
        newDevice: this.newDevice,
        admin: true,
        clientId: this.clienteselected,
        latitud: this.lat,
        longitud: this.long,
        datadevice: ""
      };

      this.$axios
        .post("/device", toSend, axiosHeaders)
        .then(res => {
          if (res.data.status == "success") {
            this.$store.dispatch("getDevices");

            this.newDevice.name = "";
            this.newDevice.dId = "";
            this.selectedIndexTemplate = null;

            this.$notify({
              type: "warning",
              icon: "tim-icons icon-check-2",
              message: "DISPOSITIVO AGREGADO"
            });

            return;
          }
        })
        .catch(e => {
          if (
            e.response.data.status == "error" &&
            e.response.data.error.errors.dId.kind == "unique"
          ) {
            this.$notify({
              type: "warning",
              icon: "tim-icons icon-alert-circle-exc",
              message: "NÚMERO DE SERIE NO VÁLIDO"
            });
            return;
          } else {
            this.showNotify("danger", "Error");
            return;
          }
        });
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
          admin: true,
          getTemplates: false,
          clientId: this.clienteselected
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

          this.templates = [];
          this.templates = res.data.data;

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

    //Delete Template
    async deleteTemplate(template) {
      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token
        },
        params: {
          templateId: template._id
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
        }
      } catch (error) {
        this.$notify({
          type: "default",
          icon: "tim-icons icon-alert-circle-exc",
          message: "Error al obtener Plantillas"
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
    },

    onDrag({ lat, lng }) {
      this.lat = lat;
      this.long = lng;
    },

    unixToDate(ms) {
      var d = new Date(parseInt(ms)),
        yyyy = d.getFullYear(),
        mm = ("0" + (d.getMonth() + 1)).slice(-2), // Months are zero based. Add leading 0.
        dd = ("0" + d.getDate()).slice(-2), // Add leading 0.
        hh = ("0" + d.getHours()).slice(-2), // Add leading 0.
        min = ("0" + d.getMinutes()).slice(-2), // Add leading 0.
        time;

      // ie: 2013-02-18, 8:35 AM
      time = dd + "/" + mm + "/" + yyyy + " - " + hh + ":" + min;

      return time;
    }
  },
  mounted() {
    this.getClients();

    // Fuse search initialization.
    this.fuseSearch = new Fuse(this.tableData, {
      keys: ["email", "type"],
      threshold: 0.3
    });
  },
  watch: {
    /**
     * Searches through the table data by a given query.
     * NOTE: If you have a lot of data, it's recommended to do the search on the Server Side and only display the results here.
     * @param value of the query
     */
    searchQuery(value) {
      let result = this.tableData;
      if (value !== "") {
        result = this.fuseSearch.search(this.searchQuery);
      }
      this.searchedData = result;
    }
  }
};
</script>
<style lang="scss">
.pagination-select,
.search-input {
  width: 200px;
}
.navbar-nav .nav-item p {
  line-height: inherit;
  margin-left: 5px;
}
</style>
