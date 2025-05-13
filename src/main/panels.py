# In main/panels.py or a similar utility file

from wagtail.admin.panels import FieldPanel as WagtailFieldPanel
from django import forms

class TaskSelectWidget(forms.Select):
    def get_context(self, name, value, attrs):
        context = super().get_context(name, value, attrs)
        
        # Get the battle page from the form instance
        if hasattr(self, 'form_instance') and hasattr(self.form_instance, 'instance'):
            instance = self.form_instance.instance
            if hasattr(instance, 'page'):
                battle_page = instance.page
                
                if battle_page and hasattr(battle_page, 'start_date') and battle_page.start_date:
                    from main.tasks import Task
                    
                    # Annotate the options with availability
                    for option_group in context['widget']['optgroups']:
                        for option in option_group[1]:
                            task_id = option['value']
                            if task_id and task_id != '':
                                try:
                                    task = Task.objects.get(id=task_id)
                                    available = task.is_available_for_battle(battle_page)
                                    
                                    if not available:
                                        option['attrs']['disabled'] = 'disabled'
                                        option['label'] += ' (Not available for these dates)'
                                except Task.DoesNotExist:
                                    pass
        
        return context

class TaskFieldPanel(WagtailFieldPanel):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
    def get_form_options(self):
        options = super().get_form_options()
        
        # We need to use a widget that will disable incompatible tasks
        widget = TaskSelectWidget()
        
        if 'widgets' not in options:
            options['widgets'] = {}
        
        options['widgets'][self.field_name] = widget
        
        return options